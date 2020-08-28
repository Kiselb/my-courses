var mycourses = (function() {

    console.log(localStorage.getItem('mycourses.user') || "");

    var bodyOnLoad = function() {
        const displayName = document.getElementById('user');
        displayName.innerText = localStorage.getItem('mycourses.user') || "";
    }
    var login = function() {
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
    
        if (!name || !password) return;
    
        const request = new XMLHttpRequest();
        request.open('POST', "http://127.0.0.1:5000/login");
        request.setRequestHeader('content-type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                localStorage.setItem('mycourses.user', name);
                const displayName = document.getElementById('user');
                displayName.innerText = name;
                window.location.href = 'http://127.0.0.1:5000/'
            } else if (request.readyState === 4 && request.status === 401) {
                localStorage.setItem('mycourses.user', "");
                const displayName = document.getElementById('name');
                displayName.innerText = "";
            }
        });
        request.send('{ "name": "' + name + '", "password": "' + password +'" }');
    }
    var logout = function() {
        const request = new XMLHttpRequest();
        request.open('POST', "http://127.0.0.1:5000/logout");
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                localStorage.setItem('mycourses.user', "");
                window.location.href = 'http://127.0.0.1:5000/'
            }
        });
        request.send('{}');
    }
    var islogged = function() {
        return !!localStorage.getItem('mycourses.user');
    }
    return {
        login: login,
        logout: logout,
        islogged: islogged,
        bodyOnLoad: bodyOnLoad
    };
})();
