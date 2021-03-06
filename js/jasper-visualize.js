import $ from 'jquery';
import _ from 'underscore';

import {SERVER, PUBLIC_FOLDER, MIN_PAGE_SIZE, KEY_CODE_ENTER} from './constants/constants'

let _this;

export class JasperVisualize {

    constructor() {
        _this = this;

    }

    initialConfig() {

    }

    drawReport() {
        const container = $('#preview-container'),
            simple = $('<button>Simple Report</button>'),
            pagination = $('<button>With pagination</button>'),
            pageRange = $('<button>Page Range</button>');

        simple.appendTo(container);
        pagination.appendTo(container);
        pageRange.appendTo(container);

        simple.click(() => _this.drawSimpleReport());
        pagination.click(() => _this.drawReportWithPagination());
        pageRange.click(() => _this.drawPageRange());

        _this.getFolderTree();

        // this.drawSimpleReport();
    }

    showAvailableOptions() {

    }

    drawSimpleReport() {
        try {
            visualize(SERVER, drawReport, _this.handleError);
        } catch (err) {
            _this.handleError(err);
        }

        function drawReport(v) {
            const simpleReport = v.report({
                resource: "/public/Reports/RL/Report_List",
                container: "#jasper-report",
                error: _this.handleError,
            });

            $('#controls-container').empty();
        }

    }


    drawReportWithPagination() {
        try {
            visualize(SERVER, drawReport, _this.handleError);
        } catch (err) {
            _this.handleError(err);
        }

        function drawReport(v) {
            const report = v.report({
                resource: "/public/Reports/RL/Report_List",
                container: "#jasper-report",
                error: _this.handleError,
                success: (data) => setTimeout(() => drawControls(data), 500)

            });

            let container = $('#controls-container'),
                prevButton = $('<button id="previousPage">Prev</button>'),
                nextButton = $('<button id="nextPage">Next</button>'),
                inputPage = $(`<input id="page-current" type="number" min="1" step="1">`);

            function drawControls() {
                const totalPages = report.data().totalPages,
                    page = _this.getCurrentPage(report),
                    inputPageLabel = $('<label></label>');

                $('<span>Page</span>').appendTo(inputPageLabel);
                inputPage.appendTo(inputPageLabel);
                $(`<span>of ${totalPages}</span>`).appendTo(inputPageLabel);

                setPaginationState();
                container.empty().append(prevButton).append(inputPageLabel).append(nextButton);

                //Events
                prevButton.click(() => {
                    let page = _this.getCurrentPage(report) - 1;
                    _this.paginate(report, page)
                        .then(setPaginationState)
                });

                nextButton.click(() => {
                    let page = _this.getCurrentPage(report) + 1;
                    _this.paginate(report, page)
                        .then(setPaginationState)
                });

                inputPage.keyup((event) => {
                    if (event.keyCode === KEY_CODE_ENTER) {
                        const page = parseInt($(event.target).val());

                        if (page < MIN_PAGE_SIZE || page > totalPages) {
                            _this.handleError('Incorrect page number!');
                        } else {
                            _this.paginate(report, page)
                                .then(setPaginationState);
                        }
                    }

                })

            }

            function setPaginationState() {
                let currentPage = report.pages(),
                    totalPages = report.data().totalPages;

                if (totalPages === MIN_PAGE_SIZE) {
                    nextButton.prop('disabled', true);
                    prevButton.prop('disabled', true);
                }

                if (currentPage === totalPages && !nextButton.prop('disabled')) {
                    nextButton.prop('disabled', true);
                    prevButton.prop('disabled', false);
                }

                if (currentPage === MIN_PAGE_SIZE && !prevButton.prop('disabled')) {
                    prevButton.prop('disabled', true);
                    nextButton.prop('disabled', false);
                }

                inputPage.prop('max', totalPages);
                inputPage.val(currentPage);
            }
        }
    }

    drawPageRange() {
        try {
            visualize(SERVER, drawReport, _this.handleError);
        } catch (err) {
            _this.handleError(err);
        }

        function drawReport(v) {
            const report = v.report({
                resource: "/public/Reports/RL/Report_List",
                container: "#jasper-report",
                pages: "1",
                error: _this.handleError,
                success: (data) => setTimeout(() => drawControls(data), 500)
            });


            function drawControls() {
                let totalPages = report.data().totalPages,
                    page = _this.getCurrentPage(report),
                    container = $('#controls-container'),
                    inputFirst = $(`<input id="page-current" type="number" min="1" step="1" max="${totalPages - 1}">`),
                    inputLast = $(`<input id="page-current" type="number" min="1" step="1" max="${totalPages}">`),
                    button = $('<button id="applyPages">Apply</button>');


                container.empty().append(inputFirst).append(inputLast).append(button);

                button.click(() => {
                    let first = inputFirst.val(),
                        last = inputLast.val();

                    if ((first && last) && (first < last)) {
                        let result = first === last ? first : `${first}-${last}`;
                        _this.paginate(report, result);
                    } else {
                        _this.handleError('Incorrect page range!')
                    }
                });

                function setInputState() {

                }

            }
        }
    }

    drawDashboard(uri) {
        visualize({
            server: 'http://rs-test.trialinteractive.net/demo/4/-',
            auth: {
                name: "jasperadmin",
                password: "jasperadmin",
                organization: "organization_1"
            }
        }, function (v) {
            v('#jasper-dashboard').dashboard({
                resource: "/public/Dashboards/Diagnostic_Dashboard",
                error: _this.handleError
            });
        });
    }

    getFolderTree() {
        try {
            visualize(SERVER, showResources, _this.handleError);
        } catch (err) {
            _this.handleError(err);
        }


        function showResources(v) {
            // let studyFolder = v.resourcesSearch({
            //     folderUri: '/',
            //     types: ['folder'],
            //     recursive: false,
            //     success: drawFolderStructure,
            //     error: _this.handleError
            // });

            let parentFolder = 'public',
                publicFolder = v.resourcesSearch({
                    folderUri: '/' + parentFolder,
                    types: ['folder'],
                    recursive: false,
                    success: (resources) => drawFolderStructure(parentFolder, resources),
                    error: _this.handleError
                });
        }

        function drawFolderStructure(parentFolder, resources) {
            const container = $('#jasper-structure'),
                ul = $('<ul class="list-unstyled"></ul>');

            _.each(resources, (resource) => {
                ul.append(buildFolder(resource));
            });

            container.empty().append(ul);
            console.log(resources);
        }

        function buildFolder(resource) {
            const folderContainer = $('<li></li>');

            $('<span class="glyphicon glyphicon-plus"></span>').appendTo(folderContainer);
            $('<span class="glyphicon glyphicon-folder-close"></span>').appendTo(folderContainer);
            $(`<span>${resource.label}</span>`).appendTo(folderContainer);

            return folderContainer;
        }
    }

    drawResourceSearch() {

    }

    //common functions

    getCurrentPage(report) {
        let page = report.pages();
        return page ? page : 1;
    }

    paginate(report, page) {
        return report.pages(page).run();
    }

    handleError(err) {
        alert(err);
    }


}