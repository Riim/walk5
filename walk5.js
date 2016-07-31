var FLAG_MATCH_NODE = 1;
var FLAG_SKIP_NODE = 1<<1;
var FLAG_INTERRUPT = 1<<2;

function walk5(node, cb, matches) {
	if (!matches) {
		matches = [];
	}

	var flags = cb(node);

	if (flags & FLAG_MATCH_NODE) {
		matches.push(node);
	}

	if (flags & FLAG_INTERRUPT) {
		return { matches: matches, interrupted: true };
	}

	if (!(flags & FLAG_SKIP_NODE)) {
		var childNodes = node.childNodes;

		if (childNodes) {
			for (var i = 0, l = childNodes.length; i < l; i++) {
				var result = walk5(childNodes[i], cb, matches);

				if (result.interrupted) {
					return result;
				}
			}
		}
	}

	return { matches: matches, interrupted: false };
}

walk5.walk = function walk(node, cb) {
	return walk5(node, function(node) {
		switch (cb(node)) {
			case true: {
				return FLAG_MATCH_NODE | FLAG_INTERRUPT;
			}
			case false: {
				return FLAG_SKIP_NODE;
			}
		}
	}).matches[0] || null;
};

walk5.walkAll = function walkAll(node, cb, matches) {
	return walk5(node, function(node) {
		switch (cb(node)) {
			case true: {
				return FLAG_MATCH_NODE;
			}
			case false: {
				return FLAG_SKIP_NODE;
			}
		}
	}).matches;
};

walk5.FLAG_MATCH_NODE = FLAG_MATCH_NODE;
walk5.FLAG_SKIP_NODE = FLAG_SKIP_NODE;
walk5.FLAG_INTERRUPT = FLAG_INTERRUPT;

module.exports = walk5;
