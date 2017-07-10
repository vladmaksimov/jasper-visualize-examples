import $ from 'jquery';

function ErrorHandler() {

    return {
        handleError: handleError
    };

    function handleError(error) {
        $.toast({
            heading: 'Error',
            text: error,
            showHideTransition: 'fade',
            icon: 'error'
        })
    }

}

export default {errorHandler: ErrorHandler()}