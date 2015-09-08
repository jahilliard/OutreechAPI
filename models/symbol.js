function Symbol () {
    var prefix;
    var symbol;
}

Symbol.prototype.initializeSymbol = function(prefix, symbol, callback) {
    this.prefix = prefix;
    this.symbol = symbol;
    callback(this);
};

module.exports = Symbol;
