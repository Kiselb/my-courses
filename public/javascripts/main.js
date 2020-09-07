var mycourses = (function() {

    console.log(localStorage.getItem('mycourses.user') || "");

    var bodyOnLoad = function() {
        const displayName = document.getElementById('user');
        displayName.innerText = localStorage.getItem('mycourses.user') || "";
        if (!!localStorage.getItem('mycourses.userId')) {
            document.getElementById("menuitem03").classList.remove('menu-item-toggle');
            document.getElementById("menuitem04").classList.remove('menu-item-toggle');
            document.getElementById("menuitem05").classList.add('menu-item-toggle');
            document.getElementById("menuitem06").classList.remove('menu-item-toggle');
            document.getElementById("menuitem07").classList.remove('menu-item-toggle');
            document.getElementById("user").classList.remove('menu-item-toggle');
        } else {
            document.getElementById("menuitem03").classList.add('menu-item-toggle');
            document.getElementById("menuitem04").classList.add('menu-item-toggle');
            document.getElementById("menuitem05").classList.remove('menu-item-toggle');
            document.getElementById("menuitem06").classList.add('menu-item-toggle');
            document.getElementById("menuitem07").classList.add('menu-item-toggle');
            document.getElementById("user").classList.add('menu-item-toggle');
        }
        const courseId = localStorage.getItem('mycourses.course.addLesson')
        if (!!courseId) {
            const dialog = document.getElementById('addLesssonToCourse');
            dialog.classList.remove('dialog-hide')
        }
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
                localStorage.setItem('mycourses.userId', JSON.parse(request.response).userId);

                document.getElementById('user').innerText = name;

                window.location.href = 'http://127.0.0.1:5000/'
            } else if (request.readyState === 4 && request.status === 401) {
                localStorage.setItem('mycourses.user', "");
                localStorage.setItem('mycourses.userId', "");

                document.getElementById('name').innerText = "";
                document.getElementById("menuitem03").classList.add('menu-item-toggle');
                document.getElementById("menuitem04").classList.add('menu-item-toggle');
                document.getElementById("menuitem05").classList.remove('menu-item-toggle');
                document.getElementById("menuitem06").classList.add('menu-item-toggle');
                document.getElementById("menuitem07").classList.add('menu-item-toggle');
                document.getElementById("user").classList.add('menu-item-toggle');
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
                localStorage.setItem('mycourses.userId', "");
                window.location.href = 'http://127.0.0.1:5000/'
            }
        });
        request.send('{}');
    }
    var islogged = function() {
        return !!localStorage.getItem('mycourses.user');
    }
    var signupStream = function(streamId) {
        console.log('StreamID: ', streamId);
        const request = new XMLHttpRequest();
        request.open('POST', "http://127.0.0.1:5000/streams/" + streamId + "/students");
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                window.location.href = 'http://127.0.0.1:5000/streams/' + streamId + '/subscribeinfo';
            } else if (request.readyState === 4 && request.status === 302) {
                window.location.href = 'http://127.0.0.1:5000/streams/' + streamId + '/subscribewarning';
            }
        });
        request.send(JSON.stringify({}));
    }
    var addLessonDialog = function(courseId) {
        const dialog = document.getElementById('addLesssonToCourse');
        localStorage.setItem('mycourses.course.addLesson', courseId)
    }
    var addLessonOK = function() {
        const courseId = localStorage.getItem('mycourses.course.addLesson');
        const request = new XMLHttpRequest();
        request.open('POST', "http://127.0.0.1:5000/courses/" + courseId + "/lessons");
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                localStorage.removeItem('mycourses.course.addLesson')
                window.location.href = 'http://127.0.0.1:5000/courses/' + courseId;
            }
        });
        const theme = document.getElementById("dialog-course-add-lesson-theme").value;
        const purpose = document.getElementById("dialog-course-add-lesson-purpose").value;
        if (!theme || !purpose) {
            return;
        }
        const elementInsertType = document.querySelector("input[name=addLesssonToCoursePositionType]:checked");
        let insertType;
        if (!!elementInsertType) {
           insertType = +elementInsertType.value;
        } else {
            return;
        }
        const insertPosition = +(document.getElementById("addLesssonToCoursePositionValue").value || 0);
        if (!(insertType < 0 || insertType === 0 || insertType > 0 && insertPosition > 0)) {
            return;
        }
        if (insertType > 0 && insertPosition < 2 ) {
            return;
        }
        const data = JSON.stringify({ theme: theme, purpose: purpose, type: insertType, position: insertPosition });
        request.send(data)
    }
    var addLessonCancel = function() {
        const courseId = localStorage.getItem('mycourses.course.addLesson');
        localStorage.removeItem('mycourses.course.addLesson');
        window.location.href = 'http://127.0.0.1:5000/courses/' + courseId;
    }
    var remLesson = function(courseId, lesson) {
        console.log('Removing:', courseId, lesson);
        const request = new XMLHttpRequest();
        request.open('DELETE', "http://127.0.0.1:5000/courses/" + courseId + "/lessons/" + lesson);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener("readystatechange", () => {
            if (request.readyState === 4 && request.status === 200) {
                window.location.href = 'http://127.0.0.1:5000/courses/' + courseId;
            }
        });
        request.send(JSON.stringify({}));
    }
    return {
        login: login,
        logout: logout,
        islogged: islogged,
        bodyOnLoad: bodyOnLoad,
        signupStream: signupStream,
        courses: {
            addLesson: {
                Dialog: addLessonDialog,
                OK: addLessonOK,
                Cancel: addLessonCancel
            },
            remLesson : remLesson
        }
    };
})();
