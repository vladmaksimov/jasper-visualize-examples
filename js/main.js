import 'babel-polyfill'; // babel polyfill is required @ runtime to support babel API's
import $ from 'jquery'; //Importing jquery
import _ from 'underscore'; //Importing underscore for templating
import '../styles/demoSass.sass'; //Importing style sheet
import {JasperVisualize} from './jasper-visualize'

class MainClass {
    constructor(){
        this.visualize = new JasperVisualize();
    }

    checkES6Uglification(){
        this.visualize.drawReport();
        // this.visualize.drawDashboard();
    };

    // checkJQuery(){
    //     $(".applyScss").append('<span>"Hello World!"</span>');
    // }
}


let primaryObject = new MainClass();

// console.log(primaryObject.checkES6Uglification());

primaryObject.checkES6Uglification();
// primaryObject.checkJQuery();
