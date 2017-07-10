import $ from 'jquery';

import {CONTAINER_REPORT, MIN_PAGE_SIZE, URI_REPORT, KEY_CODE_ENTER} from '../constants/constants'
import errorHandler from '../utils/errorHandler';

let vm = {};

function JasperReportsService() {

    init();

    return {
        simpleReport: simpleReport,
        paginatedReport: paginatedReport,
        pageRangeReport: pageRangeReport
    };

    function init() {
        vm.errorHandler = errorHandler.errorHandler;
    }

    //Public functions

    function simpleReport(uri) {
        visualize(getReport, vm.errorHandler.handleError);

        function getReport(v) {
            v.report(buildReportOptions(uri));
            $('#controls-container').empty();
        }
    }

    function paginatedReport(uri) {
        visualize(getReport, vm.errorHandler.handleError);

        function getReport(v) {
            const options = buildReportOptions(uri);
            options.success = (data) => setTimeout(() => buildPagination(data), 500);

            const report = v.report(options);

            function buildPagination() {
                const page = getCurrentPage(report);
                const pages = getTotalPages(report);

                const container = $('#controls-container');
                const prevButton = $(`<button id="previousPage">Prev</button>`);
                const nextButton = $(`<button id="nextPage">Next</button>`);
                const inputPage = $(`<input id="page-current" type="number" min="1" step="1">`);
                const inputPageLabel = $('<label></label>');

                inputPageLabel.append($('<span>Page</span>'));
                inputPageLabel.append(inputPage);
                inputPageLabel.append($(`<span>of ${pages}</span>`));

                container.empty().append(prevButton).append(inputPageLabel).append(nextButton);

                setPaginationState(report);

                prevButton.on('click', {report}, buttonPaginateEvent);
                nextButton.on('click', {report}, buttonPaginateEvent);
                inputPage.on('keyup', {report}, inputPaginateEvent);
            }
        }
    }

    function pageRangeReport(uri) {
        visualize(getReport, vm.errorHandler.handleError);

        function getReport(v) {
            const options = buildReportOptions(uri);
            options.success = (data) => setTimeout(() => buildControls(data), 500);

            const report = v.report(options);

            function buildControls() {
                const page = getCurrentPage(report);
                const pages = getTotalPages(report);

                const container = $('#controls-container');
                const applyButton = $('<button class="btn btn-default">Apply</button>');

                container.empty();

                $(`<span>From</span>`).appendTo(container);
                $(`<input id="page-start" class="pagination" type="number" min="1" step="1" max="${pages}">`).appendTo(container);
                $(`<span>to</span>`).appendTo(container);
                $(`<input id="page-end" class="pagination" type="number" min="1" step="1" max="${pages}">`).appendTo(container);
                $(`<span>of ${pages}</span>`).appendTo(container);

                container.append(applyButton);

                //events

                $('input.pagination').on('keyup', {report}, inputPageRangeEvent);
                applyButton.on('click', {report}, buttonPageRangeEvent);
            }
        }
    }

    //Events

    function buttonPaginateEvent(event) {
        const report = event.data.report;
        const page = parseInt($(event.target).val());

        paginate(report, page)
            .then(() => setPaginationState(report))
            .fail(vm.errorHandler.handleError);
    }

    function inputPaginateEvent(event) {
        const report = event.data.report;
        const page = parseInt($(event.target).val());
        const totalPages = getTotalPages(report);

        if (event.keyCode === KEY_CODE_ENTER) {
            if (page < MIN_PAGE_SIZE || page > totalPages) {
                vm.errorHandler.handleError('Incorrect page number!');
            } else {
                paginate(report, page)
                    .then(() => setPaginationState(report))
                    .fail(vm.errorHandler.handleError);
            }
        }
    }

    function inputPageRangeEvent(event) {
        if (event.keyCode === KEY_CODE_ENTER) {
            checkPageRangePagination(event);
        }
    }

    function buttonPageRangeEvent(event) {
        checkPageRangePagination(event);
    }

    //Private functions

    function setPaginationState(report) {
        const nextButton = $('#nextPage');
        const prevButton = $('#previousPage');
        const inputPage = $('#page-current');

        const currentPage = getCurrentPage(report);
        const totalPages = getTotalPages(report);

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

        nextButton.val(currentPage + 1);
        prevButton.val(currentPage - 1);
        inputPage.prop('max', totalPages);
        inputPage.val(currentPage);
    }

    function buildReportOptions(uri, params, success) {
        uri = uri ? uri : URI_REPORT;

        let options = {
            resource: uri,
            container: CONTAINER_REPORT,
            error: vm.errorHandler.handleError,
        };

        if (params) {
            options.params = params;
        }

        if (success) {
            options.success = (data) => setTimeout(() => success(data), 500)
        }

        return options;
    }

    function checkPageRangePagination(event) {
        const report = event.data.report;
        const totalPages = getTotalPages(report);
        const startPage = parseInt(getElementValue('#page-start'));
        const endPage = parseInt(getElementValue('#page-end'));

        let page = 0;

        if ((!startPage || !endPage) || startPage > endPage) {
            vm.errorHandler.handleError('Incorrect Interval!')
        } else if (startPage > totalPages || endPage > totalPages) {
            vm.errorHandler.handleError('Page can\'t be greater then total pages!')
        } else {
            page = startPage === endPage ? startPage : `${startPage}-${endPage}`;
            paginate(report, page)
                .fail(vm.errorHandler.handleError);
        }
    }

    function paginate(report, page) {
        return report.pages(page).run();
    }

    function getCurrentPage(report) {
        let page = report.pages();
        return page ? page : 1;
    }

    function getTotalPages(report) {
        return report.data()['totalPages'];
    }

    function getElementValue(element) {
        return $(element).val();
    }
}

export default {jasperReportsService: JasperReportsService()}