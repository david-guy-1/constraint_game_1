class vertex{
    constructor(name){
        this.name = name
		// these are all vertex objects (not names)
		// (possibly not immediate) predecessor and successors
        this.pred = new Set();
        this.succ = new Set();
		// immediate predecessors and successors
        this.next = new Set();
        this.prev = new Set();
    }
}
export default vertex
