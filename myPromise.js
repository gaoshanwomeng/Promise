class myPromise {
    constructor(executor) {
        executor(this._resolve, this._reject);
    }

    status = 'pending'
    value = undefined
    reason = undefined
    resolveCallback = []
    rejectCallback = []
    param = undefined

    _resolve = value => {
        this.status = 'fulfilled';
        this.value = value;
        this.resolveCallback.forEach(callback => callback(this.value));
    }

    _reject = reason => {
        this.status = 'rejected';
        this.reason = reason;
        let r = this.reason;
        this.rejectCallback.forEach(callback => callback(this.reason));
    }

    then = (handleResolve, handleReject) => {
        typeof handleResolve !== 'function' ? handleResolve = value => value : null;
        typeof handleReject !== 'function' ? handleReject = error => error : null;

        return new myPromise((nextResolve, nextReject) => {
            const resolveFn = value => {
                try {
                    let r = handleResolve(value);
                    nextResolve(r);
                } 
                catch(err) {
                    nextReject(err);
                }
            }
            const rejectFn = reason => {
                try {
                    let r = handleReject(reason);
                    nextResolve(r);
                } 
                catch(err) {
                    nextReject(err);
                }
            }
            if (this.status == 'fulfilled') {
                resolveFn(this.value);
            }
    
            if (this.status == 'rejected') {
                rejectFn(this.reason);
            }
    
            if (this.status == 'pending') {
                this.resolveCallback.push(resolveFn);
                this.rejectCallback.push(rejectFn);
            }
        })
        
    }
}

let p1 = new myPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(12345);
    }, 2000)
})

console.log(p1);

p1.then(value => {
    console.log('then resolve value -----', value);
    return 123457899;
}, reason => {
    console.log('then reject reason -----', reason);
}).then(value => {
    console.log('then then resolve value -----', value);
}, reason => {
    console.log('then then reject reason -----', reason);
})