function rnd(minv, maxv) {
	if (maxv < minv) return 0;
	return Math.floor(Math.random()*(maxv-minv+1)) + minv;
}

function getName(minlength, maxlength) {
	var vocals = 'aeiouyh' + 'aeiou' + 'aeiou';
	var cons = 'bcdfghjklmnpqrstvwxz' + 'bcdfgjklmnprstvw' + 'bcdfgjklmnprst';
	var allchars = vocals + cons;
	var length = rnd(minlength, maxlength);
	if (length < 1) length = 1;
	var consnum = 1;
	
	var name = '';
	
	for (var i = 0; i < length; i++) {
		if (consnum == 2) {
			touse = vocals;
			consnum = 0;
        } else {
            touse = allchars;
        }
		c = touse.charAt(rnd(0, touse.length - 1));
		name = name + c;
		if (cons.indexOf(c) != -1) consnum++;
	}
	name = name.charAt(0).toUpperCase() + name.substring(1, name.length);
	return name;
}
