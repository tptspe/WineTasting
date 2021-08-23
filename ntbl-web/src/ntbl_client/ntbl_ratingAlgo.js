/* eslint-disable */

export function getFinalRating(ratingObj) {
	switch (ratingObj.type) {
		case 'parker-1.0.0':
			return parker(ratingObj);
		default:
			throw 'Woops. Something went wrong. The rating could not be calculated (missing information about the type of rating). We are really sorry about the problem and an issue have been created in our system by now.';
	}
}

function parker(ratingObj) {
	//return 47;
	console.log(ratingObj);
	if (
		1 ==
		[
			...new Set([
				ratingObj.data.balance,
				ratingObj.data.length,
				ratingObj.data.intensity,
				ratingObj.data.senseofplace,
				ratingObj.data.complexity,
				ratingObj.data.quality,
				ratingObj.data.drinkability,
			]),
		].length
	) {
		if (0.45 === ratingObj.data.balance) return 90;

		if (1 === ratingObj.data.balance) return 100;

		if (0 === ratingObj.data.balance) return 50;
	}
	ratingObj.data.drinkability = 0.5;

	return ntblRatingAlgo(
		ratingObj.data.balance,
		ratingObj.data.length,
		ratingObj.data.intensity,
		ratingObj.data.senseofplace,
		ratingObj.data.complexity,
		ratingObj.data.quality,
		ratingObj.data.drinkability
	);
}

// prettier-ignore
const ntblRatingAlgo = (function(){
	var a=['sLyZR','biAGi','SPvDh','TtYaS','MirBz','FKFbO','cEKmZ','BSENL','lkljl','yxJBF','lxIVn','HEqRB','owPUj','abs','pow','BXNBf','iksgN','qDbwG','XtIQa','HiZHE','wUKfd','rfJIq','JeYYT','qlXAy','zYlJn','gJqTv','VDeWo','RgHLR','uEUDH','vuJTm','Running','HuwGF','optGM','fpeDs','bHYHq','nPBKx'];(function(c,d){var e=function(f){while(--f){c['push'](c['shift']());}};e(++d);}(a,0x1c9));var b=function(c,d){c=c-0x0;var e=a[c];return e;};var licRatingAlgo=function(){var c={};c['BXNBf']=function(d,e){return d-e;};c[b('0x0')]=function(f,g){return f/g;};c['DDSnA']=function(h,i){return h*i;};c[b('0x1')]=function(j,k){return j+k;};c[b('0x2')]=function(l,m){return l(m);};c['biRta']=function(n,o){return n*o;};c[b('0x3')]=function(p,q){return p(q);};c[b('0x4')]=b('0x5');c[b('0x6')]=function(r,s){return r/s;};c[b('0x7')]=function(t,u){return t+u;};c[b('0x8')]=function(v,w){return v+w;};c[b('0x9')]=function(x,y){return x+y;};c[b('0xa')]=function(z,A){return z*A;};c[b('0xb')]=function(B,C,D){return B(C,D);};c[b('0xc')]=function(E,F){return E*F;};c[b('0xd')]=function(G,H,I){return G(H,I);};c[b('0xe')]=function(J,K,L){return J(K,L);};c[b('0xf')]=function(M,N,O){return M(N,O);};c[b('0x10')]=function(P,Q){return P+Q;};c[b('0x11')]=function(R,S){return R+S;};c[b('0x12')]=function(T,U){return T+U;};c[b('0x13')]=function(V,W){return V+W;};c['zYlJn']=function(X,Y){return X+Y;};c[b('0x14')]=function(Z,a0){return Z(a0);};c[b('0x15')]=function(a1,a2){return a1(a2);};c[b('0x16')]=function(a3,a4){return a3(a4);};c[b('0x17')]=function(a5,a6){return a5(a6);};c['qlXAy']=function(a7,a8){return a7(a8);};var a9=function(ap){return function(aq){return Math['pow'](aq,ap);};},aa=function(ar){return function(as){return 0x1-Math[b('0x18')](Math[b('0x19')](c[b('0x1a')](as,0x1),ar));};},ab=function(at){var au={};au['wUKfd']=function(av,aw){return c.gJqTv(av,aw);};au[b('0x1b')]=function(ax,ay){return ax(ay);};au[b('0x1c')]=function(az,aA){return c.DDSnA(az,aA);};au['HiZHE']=function(aB,aC){return c.VDeWo(aB,aC);};au['rfJIq']=function(aD,aE){return c.RgHLR(aD,aE);};au[b('0x1d')]=function(aF,aG){return c.BXNBf(aF,aG);};au['JeYYT']=function(aH,aI){return c.biRta(aH,aI);};return function(aJ){return aJ<0.5?au['wUKfd'](au['iksgN'](a9,at)(au[b('0x1c')](aJ,0x2)),0x2):au[b('0x1e')](au[b('0x1f')](au[b('0x20')](aa,at)(au[b('0x1d')](au[b('0x21')](aJ,0x2),0x1)),0x2),0.5);};},ac=c['yxJBF'](ab,0x1),ad=c[b('0x15')](a9,0x2),ae=c['lxIVn'](aa,0x2),af=c[b('0x16')](ab,0x2),ag=c[b('0x17')](a9,0x3),ah=aa(0x3),ai=c[b('0x17')](ab,0x3),aj=a9(0x4),ak=c[b('0x22')](aa,0x4),al=c['qlXAy'](ab,0x4),am=c[b('0x22')](a9,0x5),an=c[b('0x22')](aa,0x5),ao=ab(0x5);function aK(aL,aM){return c[b('0x3')](aM,aL);}return function(aN,aO,aP,aQ,aR,aS,aT){console['log'](c[b('0x4')],arguments);var aU=0x32,aV=0x64,aW=2.1,aX=0.8,aY=1.3,aZ=1.2,b0=0.7,b1=0.7,b2=0.15,b3=c[b('0x6')](c[b('0x1')](c[b('0x7')](c[b('0x8')](c[b('0x9')](c[b('0x9')](c[b('0x9')](c['nPBKx'](aW,c[b('0xb')](aK,aN,ah)),c[b('0xc')](aX,c['SPvDh'](aK,aO,ah))),c[b('0xc')](aY,aK(aP,ah))),c[b('0xc')](b0,c[b('0xe')](aK,aQ,ak))),c['biAGi'](aZ,c[b('0xf')](aK,aR,ah))),c['biAGi'](b1,c[b('0xf')](aK,aS,ae))),b2*c[b('0xf')](aK,aT,an)),c[b('0x10')](c[b('0x11')](c[b('0x12')](c[b('0x13')](aW,aX)+aY,b0)+aZ,b1),b2));var b4=c[b('0x23')](aU,c[b('0xc')](c['BXNBf'](aV,aU),b3))|0x0;return b4;};}();

	return licRatingAlgo
})()
