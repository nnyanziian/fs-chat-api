    exports.handlerError =function (res, reason, message, code) {
        console.log("ERROR: " + reason);
        res.status(code || 500).json({
            "error": message,
        });
    }

    exports.validateInput = function (eInput, element) {
        //req.body.username
        if (!eInput) {
            // console.log("Invalid user input", "Must provide a " + element);
            res.status(500).json({
                "error": "Invalid user input Must provide a " + element,
            });
        }
    }
    