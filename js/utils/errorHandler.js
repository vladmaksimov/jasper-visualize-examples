function ErrorHandler() {

    return {
        handleError: handleError
    };

    function handleError(error) {
        alert(error);
    }

}

export default {errorHandler: ErrorHandler()}