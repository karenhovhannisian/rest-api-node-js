const response = {
    SUCCESS: {
        status: 200,
        json: {
            status: 'Success',
            message: 'Request was successfully completed.',
            data: null,
            errors: null
        }
    },
    SIGNED_IN: {
        status: 200,
        json: {
            status: 'Success',
            message: 'User was successfully signed in.',
            data: null,
            errors: null
        }
    },
    SIGNED_UP: {
        status: 200,
        json: {
            status: 'Success',
            message: 'User was successfully signed up.',
            data: null,
            errors: null
        }
    },
    SIGNED_OUT: {
        status: 200,
        json: {
            status: 'Success',
            message: 'User was successfully signed out.',
            data: null,
            errors: null
        }
    },
    CREATE_USER_SUCCESS: {
        status: 200,
        json: {
            status: 'Success',
            message: 'User was successfully created.',
            data: null,
            errors: null
        }
    },
    UPDATE_USER_SUCCESS : {
        status: 200,
        json: {
            status: 'Success',
            message: 'User was successfully updated.',
            data: null,
            errors: null
        }
    },
    DELETE_USER_SUCCESS:{
        status: 200,
        json: {
            status: 'Success',
            message: 'User was successfully deleted.',
            data: null,
            errors: null
        }
    }
};

export default (res, name, data = null, errors = null) => {
    let status, json;
    let details = response[name];

    if (details) {
        status = details.status;
        json = Object.assign(details.json, {
            data: data,
            errors: errors
        });
    }

    return res.status(status).json(json);
};
