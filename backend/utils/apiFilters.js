class APIFilters {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    // search the keyword product
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i',
            },
        } : {};

        this.query = this.query.find({ ...keyword });
        return this
        
    }
}

export default APIFilters;