import $ from 'jquery';
import _ from 'underscore';
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

import {CONTAINER_REPORT} from '../constants/constants'
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
            uri = uri ? uri : '/public/Reports/RL/Report_List';
            v.report(buildReportOptions(uri));
            $('#controls-container').empty();
        }
    }

    function paginatedReport() {

    }

    function pageRangeReport() {

    }

    //Events

    //Private functions

    function buildReportOptions(uri, params, success) {
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

    function paginate(report, page) {
        return report.pages(page).run();
    }

    function getCurrentPage(report) {
        let page = report.pages();
        return page ? page : 1;
    }
}


export default {jasperReportsService : JasperReportsService()}