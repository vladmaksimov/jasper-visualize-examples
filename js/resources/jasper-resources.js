import $ from 'jquery';
import _ from 'underscore';
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

import {PUBLIC_FOLDER, TYPE_FOLDER, TYPE_RESOURCES} from '../constants/constants'

import errorHandler from '../utils/errorHandler';
import JasperReportsService from '../reports/jasper-reports';

let vm = {};

function JasperResourcesService() {

    init();

    return {
        folderStructure: folderStructure,
        contentStructure: contentStructure
    };

    function init() {
        vm.errorHandler = errorHandler.errorHandler;
        vm.reportService = JasperReportsService.jasperReportsService;
    }

    //Public functions

    function folderStructure() {
        visualize(getFolders, vm.errorHandler.handleError);

        function getFolders(v) {
            const options = buildResourceOptions(PUBLIC_FOLDER, TYPE_FOLDER, false, buildFolderStructure);
            v.resourcesSearch(options);
        }
    }


    function contentStructure() {
        visualize(getFolders, vm.errorHandler.handleError);

        function getFolders(v) {
            const options = buildResourceOptions(PUBLIC_FOLDER, TYPE_RESOURCES, true, buildResourceStructure);
            v.resourcesSearch(options);
        }
    }

//Events

    function loadReport(event) {
        let uri = $(event.target).attr('uri');
        vm.reportService.simpleReport(uri);
    }

//Private functions

    function buildFolderStructure(resources) {
        const container = $('#jasper-structure');
        const ul = $('<ul></ul>');

        _.each(resources, (resource) => {
            ul.append(buildFolder(resource));
        });


        container.empty().append(ul);
    }

    function buildResourceStructure(resources) {
        const container = $('#jasper-structure');
        const table = $('<table class="table table-striped"></table>');
        const thead = $('<thead></thead>');
        const tbody = $('<tbody></tbody>');
        const tr = $('<tr></tr>');

        $('<th>Label</th>').appendTo(tr);
        $('<th>Description</th>').appendTo(tr);
        $('<th>Type</th>').appendTo(tr);
        $('<th>Create Date</th>').appendTo(tr);
        $('<th>Update Date</th>').appendTo(tr);

        tr.appendTo(thead);
        thead.appendTo(table);
        tbody.appendTo(table);

        _.each(resources, (resource) => {
            tbody.append(buildResource(resource));
        });

        container.empty().append(table);

        $('td.resource').click(loadReport)
    }

    function buildFolder(resource) {
        const folderContainer = $('<li></li>');

        $('<span class="glyphicon glyphicon-plus"></span>').appendTo(folderContainer);
        $('<span class="glyphicon glyphicon-folder-close"></span>').appendTo(folderContainer);
        $(`<span>${resource.label}</span>`).appendTo(folderContainer);

        return folderContainer;
    }

    function buildResource(resource) {
        const tr = $('<tr></tr>');

        $(`<td class="resource" uri="${resource.uri}">${resource.label}</td>`).appendTo(tr);
        $(`<td>${resource.description}</td>`).appendTo(tr);
        $(`<td>${resource['resourceType']}</td>`).appendTo(tr);
        $(`<td>${resource['creationDate']}</td>`).appendTo(tr);
        $(`<td>${resource['updateDate']}</td>`).appendTo(tr);

        return tr;
    }

    function buildResourceOptions(uri, type, recursive, success) {
        return {
            folderUri: uri,
            types: type,
            recursive: recursive,
            success: success,
            error: vm.errorHandler.handleError
        }
    }

}

export default {jasperResourcesService: JasperResourcesService()}