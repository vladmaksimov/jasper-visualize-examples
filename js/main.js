import 'babel-polyfill'; // babel polyfill is required @ runtime to support babel API's
import $ from 'jquery'; //Importing jquery
import _ from 'underscore'; //Importing underscore for templating

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

import 'jquery-toast-plugin';
import 'jquery-toast-plugin/dist/jquery.toast.min.css'

import '../styles/demoSass.sass';
import '../styles/jasper-styles.scss';
import {JasperVisualize} from './jasper-visualize';
import JasperResourcesService from './resources/jasper-resources';
import JasperReportsService from './reports/jasper-reports';
import jasperConfig from './configs/jasper.config'

class MainClass {

    constructor(){
        this.visualize = new JasperVisualize();
        this.resourceService = JasperResourcesService.jasperResourcesService;
        this.reportService = JasperReportsService.jasperReportsService;
        jasperConfig();
    }

    checkES6Uglification(){
        this.resourceService.folderStructure();
    };

}

let primaryObject = new MainClass();
primaryObject.checkES6Uglification();
