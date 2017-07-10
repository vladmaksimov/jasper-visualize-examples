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
        vm.hasEvent = false;
        vm.errorHandler = errorHandler.errorHandler;
        vm.reportService = JasperReportsService.jasperReportsService;
    }

    //Public functions

    function folderStructure(container, folder) {
        visualize((v) => loadFolders(v, container, folder), vm.errorHandler.handleError);
    }


    function contentStructure(folder) {
        visualize(getFolders, vm.errorHandler.handleError);

        function getFolders(v) {
            folder = folder ? folder : PUBLIC_FOLDER;
            const options = buildResourceOptions(folder, TYPE_RESOURCES, false, buildResourceStructure);
            v.resourcesSearch(options);
        }
    }

    //Events

    function loadReport(event) {
        let uri = $(event.target).attr('uri');
        vm.reportService.paginatedReport(uri);
    }

    function folderStructureActionEvent(event) {
        const target = $(event.target);
        const parent = target.parents('li');
        const container = target.parent().find('div.folder-container');

        if (!parent.hasClass('opened') && !parent.hasClass('closed')) {
            vm.errorHandler('Can\'t get folder status!');
            return;
        }

        if (parent.hasClass('opened')) {
            container.empty();
            changeFolderStatus(parent, true);
        } else {
            const visualize = event.data.visualize;
            const targetFolder = parent.attr('value');
            changeFolderStatus(parent, false);

            loadFolders(visualize, container, targetFolder);
        }
    }

    function folderDocumentsEvent(event) {
        console.log(event);
        console.log(event.delegateTarget);
        console.log($(event.currentTarget).attr('value'));
        contentStructure($(event.delegateTarget).attr('value'));
    }

    //Private functions

    function loadFolders(visualize, container, folder) {
        folder = folder ? folder : PUBLIC_FOLDER;
        const options = buildResourceOptions(folder, TYPE_FOLDER, false, (resources) => buildFolderStructure(visualize, container, resources, folder));
        visualize.resourcesSearch(options);
    }

    function buildFolderStructure(visualize, container, resources, folder) {
        container = container ? container : $('#jasper-structure');
        const folderStructure = $('<div class="folder-structure"></div>');
        const documentStructure = $('<div class="document-structure"></div>');

        const ul = $('<ul></ul>');

        _.each(resources, (resource) => {
            ul.append(buildFolder(resource));
        });

        folderStructure.empty().append(ul);

        container.append(folderStructure).append(documentStructure);

        //Events

        if (!vm.hasEvent) {
            $('b.icon').on('click', {visualize}, folderStructureActionEvent);
            $('li.folder').on('click', {visualize}, folderDocumentsEvent);
            vm.hasEvent = true;
        }

    }

    function buildResourceStructure(resources) {
        const container = $('.document-structure');
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
        const folderContainer = $(`<li class="folder closed" value="${resource.uri}"></li>`);
        const folder = $(`<p class="wrap folder-structure" value="${resource.uri}"></p>`);

        $(`<b class="icon"></b>`).appendTo(folder);
        $(`<span>${resource.label}</span>`).appendTo(folder);
        $(`<div class="folder-container"/>`).appendTo(folder);

        folderContainer.append(folder);

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

    function changeFolderStatus(target, isClosed) {
        if (isClosed) {
            target.removeClass('opened');
            target.addClass('closed');
        } else {
            target.removeClass('closed');
            target.addClass('opened');
        }
    }

}

export default {jasperResourcesService: JasperResourcesService()}