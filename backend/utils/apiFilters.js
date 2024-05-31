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

    // Filter the product by price, category, rating, sellers
    filters() {
        const queryCopy = { ...this.queryStr };

        // Fields to remove
        const fieldsToRemove = ['keyword'];
        fieldsToRemove.forEach((el) => delete queryCopy[el]);

        // Advance filter for price, ratings etc.
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

        console.log("============");
        console.log(queryStr);
        console.log("=============");

        this.query = this.query.find(JSON.parse(queryStr));
        return this
    }
}

export default APIFilters;