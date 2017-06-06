import 'babel-polyfill'; // babel polyfill is required @ runtime to support babel API's
import $ from 'jquery'; //Importing jquery
import _ from 'underscore'; //Importing underscore for templating

import '../styles/demoSass.sass';
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
        // this.visualize.drawReport();
        this.resourceService.contentStructure();
        this.reportService.simpleReport();
        // this.resourceService.folderStructure();
        // this.visualize.drawDashboard();
    };

}

let primaryObject = new MainClass();
primaryObject.checkES6Uglification();
