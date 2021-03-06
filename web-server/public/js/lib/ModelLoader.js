/* global define */

define([
    'lodash',
    'three',
    'require',
    'mtlloader',
    'objloader',
    'objmtlloader'
], function(_, THREE, require) {
    "use strict";

        var getCentroid = function (object) {

            var boundingBox = new THREE.Box3().setFromObject(object);

            var x0 = boundingBox.min.x;
            var x1 = boundingBox.max.x;
            var y0 = boundingBox.min.y;
            var y1 = boundingBox.max.y;
            var z0 = boundingBox.min.z;
            var z1 = boundingBox.max.z;

            var bWidth = ( x0 > x1 ) ? x0 - x1 : x1 - x0;
            var bHeight = ( y0 > y1 ) ? y0 - y1 : y1 - y0;
            var bDepth = ( z0 > z1 ) ? z0 - z1 : z1 - z0;

            var centroidX = x0 + ( bWidth / 2 ) + object.position.x;
            var centroidY = y0 + ( bHeight / 2 )+ object.position.y;
            var centroidZ = z0 + ( bDepth / 2 ) + object.position.z;

            return {x: centroidX, y: centroidY, z: centroidZ};

        }

        var scaleModel = function(ship, model) {
            var box = new THREE.Box3().setFromObject(model);
            var scale = ship.size.z / (box.max.z - box.min.z);
            model.scale.multiplyScalar(scale);
        }

        var loader	= new THREE.OBJMTLLoader();

        var modelUrls = {

            SpaceFighter02: {
                baseUrl: require.toUrl('../components/threex.spaceships/'),
                objUrl: 'models/SpaceFighter02/SpaceFighter02.obj',
                mtlUrl: 'models/SpaceFighter02/SpaceFighter02.mtl'
            },

            SpaceStation01: {
                baseUrl: require.toUrl('../models/SpaceStation01/'),
                objUrl: 'SpaceStation01.obj',
                mtlUrl: 'SpaceStation01.mtl'
            }

        };

        return {

            loadModel: function(ship, onLoadFunc) {

                if (ship.model == "Sun") {

                    var sunDiameter = 1392684;
                    var geometry = new THREE.SphereGeometry(sunDiameter, 64, 64);
                    var material = new THREE.MeshBasicMaterial({color: "yellow"});
                    var object3d = new THREE.Mesh(geometry, material);

                    object3d.centeroid = getCentroid(object3d);
                    onLoadFunc && onLoadFunc(object3d)

                    return;
                }

                var source = modelUrls[ship.model];

                loader.load(source.baseUrl + source.objUrl, source.baseUrl + source.mtlUrl, function(object3d) {
                    scaleModel(ship, object3d);
                    object3d.centeroid = getCentroid(object3d);
                    onLoadFunc && onLoadFunc(object3d)
                });
            }

        };

});
