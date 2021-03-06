import Immutable from 'seamless-immutable';

/*
 * Custom getIn function
 *
 * Using custom getIn because Seamless Immutable's getIn function does not default to
 * the original object when path is empty.
 */
function getIn(obj, path) {
    let pointer = obj;
    for (let el of path) {
        pointer = pointer
            ? pointer[el]
            : undefined;
    }

    return pointer;
}

/*
 * Cursor data that is private to the class/module.
 *
 * Instances of this class manage MUTABLE data associated with a cursor. This includes:
 * - The current generation of the immutable state object
 * - The current list of change listeners
 *
 * Because this class is private to the module and never returned to an outside caller,
 * its usage is known to us. It can ONLY be constructed by a root cursor and is shared
 * between the root cursor and any child cursors 'refined' from there.
 */
class PrivateData {
    constructor(initialData) {
        this.currentData = initialData;
        this.changeListeners = [];
    }

    /*
     * Updates the portion of this.currentData referenced by 'path' with the 'newValue'
     */
    update(path, newValue) {
        // this.currentData is about to become the "previous generation"
        const prevData = this.currentData;

        if (path.length === 0) {
            // Replace the data entirely. We must manually force its immutability when we do this.
            this.currentData = Immutable(newValue);
        }
        else {
            // Apply the update to produce the next generation. Because this.currentData has
            // been processed by seamless-immutable, nextData will automatically be immutable as well.
            this.currentData = this.currentData.setIn(path, newValue);
        }

        // Notify all change listeners
        for (let changeListener of this.changeListeners) {
            let shouldUpdate = true;
            let shorterPathLength = Math.min(path.length, changeListener.path.length);

            // Only update if the change listener path is a sub-path of the update path (or vice versa)
            for(let i = 1; i < shorterPathLength; i++) {
                shouldUpdate = shouldUpdate && (path[i] === changeListener.path[i])
            }

            if(shouldUpdate) {
                // Only call change listener if associated path data has changed
                if(getIn(this.currentData, changeListener.path) !== getIn(prevData, changeListener.path)) {
                    // Pass nextData first because many listeners will ONLY care about that.
                    changeListener(this.currentData, prevData, path);
                }
            }
        }
    }

    /*
     * Adds a new change listener to this managed data with the following signature:
     *      function changeListener(nextRoot, prevRoot, pathUpdated)
     *
     * Where the parameters pass to this function have the following data types
     *      nextRoot - Next generation of the JSON-style immutable data being managed by a cursor
     *      prevRoot - Previous generation of the JSON-style immutable data being managed by a cursor
     *      pathUpdated - Array of String indicating the keys used to navigate a nested/hierarchical
     *                    structure to the point where the update occurred.
     */
    addListener(changeListener) {
        this.changeListeners.push(changeListener);
    }

    /*
     * Removes change listener
     */
    removeListener(changeListener) {
        this.changeListeners.splice(this.changeListeners.indexOf(changeListener), 1)
    }
}

/*
 * ES6 classes don't have a direct provision for private data, but we can associate data
 * with a class via a WeakMap and hide that WeakMap within the module.
 *
 * This WeakMap is of mapping of Cursor->PrivateData
 */
const privateDataMap = new WeakMap();

/*
 * Implementation of a cursor referencing an evolving immutable data structure.
 *
 * Note that callers of this module CAN receive instances of this class through
 * the normal usage pattern of constructing a 'RootCursor' object and then
 * calling 'refine', but they cannot construct them on their own.
 */
class Cursor {
    /*
     * This class is private to the module, so its constructor is impossible to
     * invoke externally. This is good since the "privateData" parameter of the
     * constructor is not something we want external callers to attempt to provide.
     */
    constructor(privateData, path) {
        // Keep our private data hidden. This data is 'owned' by a RootCursor and
        // shared with all cursors 'refined' from that root (or 'refined' from a
        // child cursor of that root)
        privateDataMap.set(this, privateData);

        // Path will have already been locked by seamless-immutable
        this.path = path;

        // Freeze ourselves so that callers cannot re-assign the path post-construction
        Object.freeze(this);
    }

    /*
     * Property getter for 'data' property of a cursor. This returns the section of the
     * current generation of immutable data referred to by the path of the cursor.
     *
     * Calling this getter over time may return different results, but the data returned
     * is an immutable object that can be safely referenced without copy.
     *
     * This getter returns undefined in the case where the path specified by the cursor
     * does not exist in the current generation of the managed data.
     */
    get data() {
        return getIn(privateDataMap.get(this).currentData, this.path);
    }

    /*
     * Property setter for 'data' property of a cursor. This creates a new generation
     * of the managed data object with the provided 'newValue' replacing whatever
     * exists in the 'path' of the current generation
     *
     * No attempt is made to address issues such as stale writes. Concurrency issues
     * are the responsibility of caller.
     */
    set data(newValue) {
        privateDataMap.get(this).update(this.path, newValue);
    }

    /*
     * Create a new child cursor from this cursor with the subPath appended to our current path
     */
    refine(subPath) {
        if (subPath.length === 0) {
            return this;
        }
        else {
            // Because this.path is already immutable, this.path.concat returns
            // a new immutable array.
            return new Cursor(privateDataMap.get(this), this.path.concat(subPath));
        }
    }

    /*
     * Adds a new change listener to this cursor with the following signature:
     *      function changeListener(nextRoot, prevRoot, pathUpdated)
     *
     * Where the parameters pass to this function have the following data types
     *      nextRoot - Next generation of the JSON-style immutable data being managed by a cursor
     *      prevRoot - Previous generation of the JSON-style immutable data being managed by a cursor
     *      pathUpdated - Array of String indicating the keys used to navigate a nested/hierarchical
     *                    structure to the point where the update occurred.
     */
    onChange(changeListener) {
        changeListener.path = this.path;
        privateDataMap.get(this).addListener(changeListener, this.path);
    }

    /*
     * Removes change listener
     */
    removeListener(changeListener) {
        privateDataMap.get(this).removeListener(changeListener);
    }
}

/*
 * Public entry into this module.
 *
 * RootCursor objects are the same as regular cursor objects except that:
 * 1. The 'root' cursor can be constructed by external callers
 * 2. The 'root' cursor can register changeListeners
 */
export default class RootCursor extends Cursor {
    constructor(initialRoot = {}) {
        // Use seamless-immutable to constrain the initial data. This is the only
        // place where we invoke seamless-immutable because once we do this, our
        // interactions with these objects will only spawn other immutable objects
        super(new PrivateData(Immutable(initialRoot)), Immutable([]));
    }
}
