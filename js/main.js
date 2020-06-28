(function ($) {
    var $window = $(window),
        $body = $('body'),
        $wrapper = $('#wrapper'),
        $header = $('#header'),
        $footer = $('#footer'),
        $main = $('#main'),
        $main_articles = $main.children('article');

        var slickSlider_responsive = {
            slidesToShow: 1,
            slidesToScroll:1,
            variableWidth: false,
            arrows: false,
            //prevArrow: '<a role="button" class="slick-nav slick-prev pointer slick-arrow"></a>',
            //nextArrow: '<a role="button" class="slick-nav slick-next pointer slick-arrow"></a>',
            dots:false,
            autoplay: true,
            speed: 1500,
            autoplaySpeed: 3000,
            responsive: [
                {
                    breakpoint: 1400,
                    settings: {
                    }
                },
            {
                breakpoint: 540,
                settings: {
                    arrows: false,
                }
            }]
          };

    // Play initial animations on page load.
    $window.on('load', function () {
        window.setTimeout(function () {
            $body.removeClass('is-preload');
        }, 100);
    }); 
    // Main.
    var delay = 325,
        locked = false,
        articleVisible = false;

    function addSlider(el) {
        var sslider = el.find('.image-slider');
        sslider.slick(slickSlider_responsive);
        sslider.css('visibility','visible');
    }    

    function removeSlider(el) {
        var sslider = el.find('.image-slider');
        sslider.css('visibility','hidden');
        sslider.slick('unslick');
        trace("slider removed");
    }

    // Methods.
    $main._show = function (id, initial) {

        var $article = $main_articles.filter('#' + id);

        // No such article? Bail.
        if ($article.length == 0)
            return;

        // Handle lock.

        // Already locked? Speed through "show" steps w/o delays.
        if (locked || (typeof initial != 'undefined' && initial === true)) {
            
            // Mark as switching.
            $body.addClass('is-switching');

            // Mark as visible.
            $body.addClass('is-article-visible');

            // Deactivate all articles (just in case one's already active).
            $main_articles.removeClass('active');

            // Hide header, footer.
            $header.hide();
            $footer.hide();

            // Show main, article.
            $main.show();
            $article.show();
            articleVisible = true;
            // Activate article.
            $article.addClass('active');

            addSlider($article);

            // Unlock.
            locked = false;

            // Unmark as switching.
            setTimeout(function () {
                $body.removeClass('is-switching');
            }, (initial ? 1000 : 0));

            return;

        }

        // Lock.
        locked = true;

        // Article already visible? Just swap articles.
        if ($body.hasClass('is-article-visible')) {
           
            // Deactivate current article.
            var $currentArticle = $main_articles.filter('.active');

            $currentArticle.removeClass('active');

            // Show article.
            setTimeout(function () {

                // Hide current article.
                $currentArticle.hide();
                // Show article.
                $article.show();
                articleVisible = true;
                // Activate article.
                setTimeout(function () {

                    $article.addClass('active');

                    // Window stuff.
                    $window
                        .scrollTop(0)
                        .triggerHandler('resize.flexbox-fix');

                    // Unlock.
                    setTimeout(function () {
                        locked = false;
                    }, delay);

                }, 25);

            }, delay);

        }

        // Otherwise, handle as normal.
        else {

            // Mark as visible.
            $body
                .addClass('is-article-visible');
                articleVisible = true;

            // Show article.
            setTimeout(function () {
                

                // Hide header, footer.
                $header.hide();
                $footer.hide();

                // Show main, article.
                $main.show();
                $article.show();

                addSlider($article);

                // Activate article.
                setTimeout(function () {

                    $article.addClass('active');

                    // Window stuff.
                    $window
                        .scrollTop(0)
                        .triggerHandler('resize.flexbox-fix');

                    // Unlock.
                    setTimeout(function () {
                        locked = false;
                    }, delay);

                }, 25);

            }, delay);

        }

    };

    $main._hide = function (addState) {

        var $article = $main_articles.filter('.active');

        // Article not visible? Bail.
        if (!$body.hasClass('is-article-visible'))
            return;

        // Add state?
        if (typeof addState != 'undefined'
            && addState === true)
            history.pushState(null, null, '#');

        // Handle lock.
        trace("article stop");
        // Already locked? Speed through "hide" steps w/o delays.
        if (locked) {

            // Mark as switching.
            $body.addClass('is-switching');

            // Deactivate article.
            $article.removeClass('active');

            // Hide article, main.
          
            $article.hide();
            $main.hide();

            // Show footer, header.
            $footer.show();
            $header.show();

            // Unmark as visible.
            $body.removeClass('is-article-visible');
            articleVisible = false;

            // Unlock.
            locked = false;

            // Unmark as switching.
            $body.removeClass('is-switching');

            // Window stuff.
            $window
                .scrollTop(0)
                .triggerHandler('resize.flexbox-fix');

            return;

        }

        removeSlider($article);
        stopAllIframeVideos();

        // Lock.
        locked = true;

        // Deactivate article.
        $article.removeClass('active');

        // Hide article.
        setTimeout(function () {

            // Hide article, main.
            $article.hide();
            $main.hide();

            // Show footer, header.
            $footer.show();
            $header.show();

            // Unmark as visible.
            setTimeout(function () {

                $body.removeClass('is-article-visible');
                articleVisible = false;
                // Window stuff.
                $window
                    .scrollTop(0)
                    .triggerHandler('resize.flexbox-fix');

                // Unlock.
                setTimeout(function () {
                    locked = false;
                }, delay);

            }, 25);

        }, delay);


    };

    // Articles.
    $main_articles.each(function () {

        var $this = $(this);

        //$this.find('.slick-slider').slick(slickSlider_responsive);

        // Close.
        $('<div class="close">Close</div>')
            .appendTo($this)
            .on('click', function () {
                location.hash = '';
            });

        // Prevent clicks from inside article from bubbling.
        $this.on('click', function (event) {
            event.stopPropagation();
        });
    });

    // Events.
    $body.on('click', function (event) {

        // Article visible? Hide.
        //if ($body.hasClass('is-article-visible'))
            //$main._hide(true);
    
    });

    /*$window.on('keyup', function (event) {

        switch (event.keyCode) {

            case 27:

                // Article visible? Hide.
                if ($body.hasClass('is-article-visible'))
                    $main._hide(true);

                break;

            default:
                break;

        }

    });*/
    function getUrlParams(prop){
        var p={};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,prop,v){p[prop]=v})
        return prop?p[prop]:p;
    }


    $window.on('hashchange', function (event) {
        // Empty hash?
        if (location.hash == ''
            || location.hash == '#') {

            // Prevent default.
            event.preventDefault();
            event.stopPropagation();

            // Hide.
            $main._hide();

        }

        // Otherwise, check for a matching article.
        else if ($main_articles.filter(location.hash).length > 0) {

            // Prevent default.
            event.preventDefault();
            event.stopPropagation();

            // Show article.
            $main._show(location.hash.substr(1));

        }

    });

    // Scroll restoration.
    // This prevents the page from scrolling back to the top on a hashchange.
    if ('scrollRestoration' in history)
        history.scrollRestoration = 'manual';
    else {

        var oldScrollPos = 0,
            scrollPos = 0,
            $htmlbody = $('html,body');

        $window
            .on('scroll', function () {

                oldScrollPos = scrollPos;
                scrollPos = $htmlbody.scrollTop();

            })
            .on('hashchange', function () {
                $window.scrollTop(oldScrollPos);
            });

    }

    // Initialize.

    // Hide main, articles.
    $main.hide();
    $main_articles.hide();
    
    var editMode = false;
    var mode = getUrlParams("mode");
    if (mode) {
        mode.replace('#','');
        editMode = (mode == "edit")?true:false;
    }

    // Initial article.
    if (location.hash != ''
        && location.hash != '#')
        $window.on('load', function () {
            $main._show(location.hash.substr(1), true);
        });



    /*
             ███████████    █████████   ██████   █████    ███████   
            ░░███░░░░░███  ███░░░░░███ ░░██████ ░░███   ███░░░░░███ 
             ░███    ░███ ░███    ░███  ░███░███ ░███  ███     ░░███
             ░██████████  ░███████████  ░███░░███░███ ░███      ░███
             ░███░░░░░░   ░███░░░░░███  ░███ ░░██████ ░███      ░███
             ░███         ░███    ░███  ░███  ░░█████ ░░███     ███ 
             █████        █████   █████ █████  ░░█████ ░░░███████░  
            ░░░░░        ░░░░░   ░░░░░ ░░░░░    ░░░░░    ░░░░░░░    
    */


    var camera, scene, renderer;
    var interactiveObjects, selectedObject;
    var isUserInteracting = false,
        onMouseDownMouseX = 0, onMouseDownMouseY = 0,
        lon = 180, onMouseDownLon = 0,
        lat = 0, onMouseDownLat = 0,
        phi = 0, theta = 0;

    var control;
    var jsonScene;

    var manager = new THREE.LoadingManager();
    var loader = new THREE.TextureLoader(manager);

    function init() {

        var container, mesh;
        container = document.getElementById('scene');

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
        camera.target = new THREE.Vector3(0, 0, 0);

        scene = new THREE.Scene();

        var geometry = new THREE.SphereBufferGeometry(parseInt(jsonScene.panoRadius), 60, 40);
        // invert the geometry on the x-axis so that all of the faces point inward
        geometry.scale(- 1, 1, 1);

        var texture = loader.load(jsonScene.folder+jsonScene.panoImage);
        var material = new THREE.MeshBasicMaterial({ wireframe: false, map: texture });

        mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);

        // add light
        var light = new THREE.AmbientLight(0xffffff);
        scene.add(light);

        //addRandomCubes(10);
        setupKeyControls();

        // debug
        control = new function () {
            this.positionX = 0;
            this.positionY = 0;
        };
        //addControls(control);

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        document.addEventListener('mousedown', onPointerStart, false);
        document.addEventListener('mousemove', onPointerMove, false);
        document.addEventListener('mouseup', onPointerUp, false);

        document.addEventListener('wheel', onDocumentMouseWheel, false);

        document.addEventListener('touchstart', onPointerStart, false);
        document.addEventListener('touchmove', onPointerMove, false);
        document.addEventListener('touchend', onPointerUp, false);

        window.addEventListener('resize', onWindowResize, false);
    }


    function addControls(controlObject) {
        var gui = new dat.GUI();
        gui.add(controlObject, 'positionX', -100, 100);
        gui.add(controlObject, 'positionY', -100, 100);
    }

    
    function addLoadedGeometry() {
        interactiveObjects = [];

        var w = parseInt(jsonScene.poiWidth);
        var h = parseInt(jsonScene.poiHeight);
        //var geometry = new THREE.BoxBufferGeometry(20, 20, 20);
        var geometry = new THREE.PlaneGeometry(w, h, 10);
        var l = jsonScene.objects.length;

        for (var i = 0; i < l; i++) {
            var mat = new THREE.MeshPhongMaterial();
            mat.map = new THREE.TextureLoader().load(jsonScene.folder+jsonScene.objects[i].poi);
            mat.flatShading = true;
            mat.transparent = true;
            var object = new THREE.Mesh(geometry, mat);
            object.userData.id = i;
            object.userData.name = jsonScene.objects[i].name;
            object.userData.link = jsonScene.objects[i].link;
            //var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff, map:new THREE.ImageUtils.loadTexture("./blatt.png") }));
            object.position.x = parseInt(jsonScene.objects[i].x);
            object.position.y = parseInt(jsonScene.objects[i].y);
            object.position.z = parseInt(jsonScene.objects[i].z);

            if (jsonScene.objects[i].scalePercent) {
                var fac = parseInt(jsonScene.objects[i].scalePercent) / 100;
                object.scale.set(fac, fac, fac)
            } 
            object.lookAt(camera.position);

            scene.add(object);
            interactiveObjects.push(object);
        }
    }

    function addRandomCubes(no) {
        interactiveObjects = [];

        //var geometry = new THREE.BoxBufferGeometry(20, 20, 20);
        var geometry = new THREE.PlaneGeometry(50, 50, 10);

        for (var i = 0; i < no; i++) {
            var mat = new THREE.MeshPhongMaterial();
            mat.map = new THREE.TextureLoader().load("./jesus1.png");
            mat.flatShading = true;
            mat.transparent = true;
            var object = new THREE.Mesh(geometry, mat);
            object.userData.id = i;
            //var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff, map:new THREE.ImageUtils.loadTexture("./blatt.png") }));
            object.position.x = Math.random() * 800 - 400;
            object.position.y = 0;//Math.random() * 450 - 220;
            object.position.z = Math.random() * 450 - 250;
            object.lookAt(camera.position);

            scene.add(object);
            interactiveObjects.push(object);
        }
    }

    function setupKeyControls() {

        document.onkeydown = function (e) {
            if (selectedObject != null) {
                trace(e.key);
                switch (e.key) {
                    case 'ArrowLeft':
                        selectedObject.position.z += 2;
                        break;
                    case 'ArrowRight':
                        selectedObject.position.z -= 2;
                        break;
                    case 'ArrowUp':
                        selectedObject.position.x -= 2;
                        break;
                    case 'ArrowDown':
                        selectedObject.position.x += 2;
                        break;
                    case 'PageUp':
                        selectedObject.position.y += 2;
                        break;
                    case 'PageDown':
                        selectedObject.position.y -= 2;
                        break;
                    case '+':
                        var sc = selectedObject.scale.x;
                        sc += .05
                        selectedObject.scale.set(sc, sc, sc)
                        break;
                    case '-':
                        var sc = selectedObject.scale.x;
                        sc -= .05
                        selectedObject.scale.set(sc, sc, sc)
                    break;
                }
                trace(selectedObject.position.x + " : " + selectedObject.position.y + " : " + selectedObject.position.z);
            }
        };
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    function jump(h){
        var url = location.href;               //Save down the URL without hash.
        location.href = "#"+h;                 //Go to the target element.
        //history.replaceState(null,null,url);   //Don't like hashes. Changing it back.
    }

    /* ray camera-object*/
    var tube;
    /* intersection calculation */
    var projector = new THREE.Projector();

    function detectObjects(posX, posY) {

        var vector = new THREE.Vector3((posX / window.innerWidth) * 2 - 1, -(posY / window.innerHeight) * 2 + 1, 0.5);
        projector.unprojectVector(vector, camera);

        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        var intersects = raycaster.intersectObjects(interactiveObjects);

        if (intersects.length > 0) {
            // reset others
            for (var i = 0; i < interactiveObjects.length; i++) {
                if (intersects[0].object != interactiveObjects[i]) {
                    //interactiveObjects[i].material.opacity = 1;
                    interactiveObjects[i].material.map = new THREE.TextureLoader().load(jsonScene.folder+jsonScene.objects[i].poi);
                }
            }

            intersects[0].object.material.transparent = true;

            if (!editMode) {
                jump(intersects[0].object.userData.link);
            } else {
            if (intersects[0].object == selectedObject) {
            //if (intersects[0].object.material.opacity !== 1) {
                //intersects[0].object.material.opacity = 1;
                var id = intersects[0].object.userData.id;
                intersects[0].object.material.map = new THREE.TextureLoader().load(jsonScene.folder+jsonScene.objects[id].poi);
                prompt("Koordinaten von: "+selectedObject.userData.name, '"x":'+selectedObject.position.x+'", y":'+selectedObject.position.y+'", z":'+selectedObject.position.z+'", scalePercent":'+parseInt(selectedObject.scale.x*100));
                
                selectedObject = null;
            } else {
                //intersects[0].object.material.opacity = 0.5;
                intersects[0].object.material.map = new THREE.TextureLoader().load("./images/move.png");
                selectedObject = intersects[0].object;
            }
        }
        }
    }
    
    function onPointerStart(event) {
        if (articleVisible) return;
        
            isUserInteracting = true;
            var clientX = event.clientX || event.touches[0].clientX;
            var clientY = event.clientY || event.touches[0].clientY;

            onMouseDownMouseX = clientX;
            onMouseDownMouseY = clientY;

            onMouseDownLon = lon;
            onMouseDownLat = lat;

            detectObjects(clientX, clientY);
        
    }

    function onPointerMove(event) {
        if (articleVisible) return;

        if (isUserInteracting === true) {
            var clientX = event.clientX || event.touches[0].clientX;
            var clientY = event.clientY || event.touches[0].clientY;

            lon = (onMouseDownMouseX - clientX) * 0.1 + onMouseDownLon;
            lat = (clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat;
        }
    
    }

    function onPointerUp() {
        isUserInteracting = false;
       
    }

    function onDocumentMouseWheel(event) {
        if (articleVisible) return;
            var fov = camera.fov + event.deltaY * 0.05;
            camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
            camera.updateProjectionMatrix();
        
    }

    function animate() {
        requestAnimationFrame(animate);
        update();
    }

    function update() {
        if (isUserInteracting === false) {
            //lon += 0.1;
        }

        lat = Math.max(- 85, Math.min(85, lat));
        phi = THREE.MathUtils.degToRad(90 - lat);
        theta = THREE.MathUtils.degToRad(lon);

        camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
        camera.target.y = 500 * Math.cos(phi);
        camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

        camera.lookAt(camera.target);

        /*
        // distortion
        camera.position.copy( camera.target ).negate();
        */
        renderer.render(scene, camera);
    }
    /*
     █████   █████ █████ ██████████   ██████████    ███████   
    ░░███   ░░███ ░░███ ░░███░░░░███ ░░███░░░░░█  ███░░░░░███ 
     ░███    ░███  ░███  ░███   ░░███ ░███  █ ░  ███     ░░███
     ░███    ░███  ░███  ░███    ░███ ░██████   ░███      ░███
     ░░███   ███   ░███  ░███    ░███ ░███░░█   ░███      ░███
      ░░░█████░    ░███  ░███    ███  ░███ ░   █░░███     ███ 
        ░░███      █████ ██████████   ██████████ ░░░███████░  
         ░░░      ░░░░░ ░░░░░░░░░░   ░░░░░░░░░░    ░░░░░░░    
*/
    function stopAllIframeVideos() {
        $("iframe").each(function() { 
            var src= $(this).attr('src');
            $(this).attr('src',src);  
        });                                                              
    }                                                              
                                                               
    /*
      █████████  ███████████   █████████   ███████████   ███████████
     ███░░░░░███░█░░░███░░░█  ███░░░░░███ ░░███░░░░░███ ░█░░░███░░░█
    ░███    ░░░ ░   ░███  ░  ░███    ░███  ░███    ░███ ░   ░███  ░ 
    ░░█████████     ░███     ░███████████  ░██████████      ░███    
     ░░░░░░░░███    ░███     ░███░░░░░███  ░███░░░░░███     ░███    
     ███    ░███    ░███     ░███    ░███  ░███    ░███     ░███    
    ░░█████████     █████    █████   █████ █████   █████    █████   
     ░░░░░░░░░     ░░░░░    ░░░░░   ░░░░░ ░░░░░   ░░░░░    ░░░░░    
*/                                                                    
                                                                    
                                                                    
    function trace(s) { try { console.log(s); } catch (e) {/*alert(s); */ } }
    function showProp(obj) { for (var key in obj) trace(key + " : " + obj[key]); }

    
    var data = document.getElementById('scenedata');
    if (data) {
        jsonScene =  JSON.parse(data.innerHTML).scene;
        init();
        addLoadedGeometry();
        animate();
    } else {
        alert("No Scene Data");
    }


})(jQuery);