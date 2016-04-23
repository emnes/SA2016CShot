(function () {
  'use strict';

  var v1, r;
  var EPS = 0.000001;

  THREE.Quaternion.prototype.setFromUnitVectors =  function ( vFrom, vTo ) {

    if ( v1 === undefined ) v1 = new THREE.Vector3();

    r = vFrom.dot( vTo ) + 1;

    if ( r < EPS ) {

      r = 0;

      if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

        v1.set( - vFrom.y, vFrom.x, 0 );

      } else {

        v1.set( 0, - vFrom.z, vFrom.y );

      }

    } else {

      v1.crossVectors( vFrom, vTo );

    }

    this._x = v1.x;
    this._y = v1.y;
    this._z = v1.z;
    this._w = r;

    this.normalize();

    return this;
  };
})();
