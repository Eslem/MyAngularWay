/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = new App();

function App() {
    this.controllers = {};
    this.routes = {};

    this.addRoute = function (name, route) {
        this.routes[name] = route;
    };

    this.addController = function (controller) {
        controllers[controller.name] = controller;
    };
}

function Controller(name, elemHTML, funct) {
    this.$scope = {
        $elemHTML: {},
        $elemHTMLRepeat: [],
        $elemHTMLClick: {}
    };
    this.name = name;
    this.func = funct;
    this.elemName = elemHTML;

    this.replaceHTML = function () {
        this.elemHTML = document.getElementById(this.elemName);
        var elements = this.elemHTML.getElementsByTagName("*");
        //var matchs=[];
        for (var i = 0; i < elements.length; i++) {
            var inner = elements[i];
            var regExp = /\[\[(.*?)\]\]/g;
            var match = inner.textContent.match(regExp);
            if (match !== null) {
                for (var x = 0; x < match.length; x++) {
                    if (this.$scope.$elemHTML[match[x]] === undefined) {
                        this.$scope.$elemHTML[match[x]] = [inner];
                    } else {
                        this.$scope.$elemHTML[match[x]].push(inner);
                    }
                }
            }

            //repeat
            if (inner.getAttribute("data-repeat") !== null && inner.getAttribute("data-repeat") !== undefined) {
                this.$scope.$elemHTMLRepeat.push(inner);
            }

            //click
            if (inner.getAttribute("data-click") !== null && inner.getAttribute("data-click") !== undefined) {
                var attr = inner.getAttribute("data-click");
                var name = attr.split("(")[0];
                var regExp = /\((.*?)\)/;
                var match = attr.match(regExp);
                // console.log(name);
               // inner.onclick = this.$scope[name](match[0]);


                //this.$scope.$elemHTMLClick.push(inner);
                //console.log(this.$scope[inner.getAttribute("data-click").split("(")[0]]);
                //  inner.onclick = this.$scope.view("cew");
            }

        }
        this.renderHTML();
    };


    this.renderHTML = function () {

        for (var i = 0; i < this.$scope.$elemHTMLRepeat.length; i++) {
            var elem = this.$scope.$elemHTMLRepeat[i];
            var splited = elem.getAttribute("data-repeat").split(" ");
            var name = splited[0];
            for (var i = 0; i < this.$scope[splited[2]].length; i++) {
                elem.removeAttribute("data-repeat");
                var elemCloned = elem.cloneNode(false);
                var text = elem.innerHTML;

                for (x in this.$scope[splited[2]][i]) {
                    text = text.replace("[[" + name + "." + x + "]]", this.$scope[splited[2]][i][x]);
                }

                elemCloned.innerHTML = text;
                elem.parentNode.appendChild(elemCloned);
            }
            elem.parentNode.removeChild(elem);

        }


        for (var i = 0; i < this.$scope.$elemHTMLClick.length; i++) {
            var elem = this.$scope.$elemHTMLClick[i];
            var func = elem.getAttribute("data-click");
            console.log(this.$scope[func]);
        }

        for (var x in this.$scope) {
            if (this.$scope.$elemHTML["[[" + x + "]]"] !== null && this.$scope.$elemHTML["[[" + x + "]]"] !== undefined) {
                var elem = this.$scope.$elemHTML["[[" + x + "]]"];
                for (var i = 0; i < elem.length; i++) {
                    elem[i].textContent = elem[i].textContent.replace("[[" + x + "]]", this.$scope[x]);
                }
            }


        }
    };
}

function Route(viewPath, controller) {
    this.name = name;
    this.viewPath = viewPath;
    this.controller = controller;

    this.show = function () {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", this.viewPath + '?_=' + new Date().getTime(), false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    var allText = rawFile.responseText;
                    document.getElementById("wrap-body").innerHTML = allText

                    controller.func(controller.$scope);
                    controller.replaceHTML();
                    return allText;
                }
            }
        };
        rawFile.send(null);
    };

}


function showRoute(name) {
    app.routes[name].show();
}

var userController = new Controller("userController", "users", function ($scope) {
    $scope.blabla = "Hola";
    $scope.nombre = "Usuario";

    $scope.users = [
        {
            name: "nombre1",
            email: "efdw@fe4fr.com"
        },
        {
            name: "nombre2",
            email: "vdfvdf@fe4fr.com"
        }
    ];


    $scope.view = function (user) {
        alert(user);
    };
});

var userRoute = new Route("views/user.html", userController);
app.addRoute("user", userRoute);