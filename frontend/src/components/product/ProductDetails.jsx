import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductDetailsQuery } from "../../redux/api/productsApi";
import { toast } from "react-hot-toast";
import Loader from "../layout/Loader";
import StarRatings from "react-star-ratings";

const ProductDetails = () => {
  const params = useParams();

  const { data, isLoading, error, isError } = useGetProductDetailsQuery(
    params?.id
  );
  // const product = data?.product;

  const [activeImg, setActiveImg] = useState("");

  

  useEffect(() => {
    setActiveImg(
      data?.product?.images[0]
        ? data?.product?.images[0]?.url
        : "/images/default_product.png"
    );
  }, [data?.product_id, data?.product?.images]);

  

  console.log("==================data?=========",data);

  
  // console.log("==================data___product_id?=========",data.product._id);

  
  // console.log("==================data___product__image?=========",data.product._id.images);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError, error?.data?.message]);

  if (isLoading) return <Loader />;

  return (
    <div className="row d-flex justify-content-around">
      <div className="col-12 col-lg-5 img-fluid" id="product_image">
        <div className="p-3">
          <img
            className="d-block w-100"
            src={activeImg}
            alt={data?.productId?.name}
            width="340"
            height="390"
          />
        </div>
        <div className="row justify-content-start mt-5">
          {data?.product.images?.map((img) => (
            <div className="col-2 ms-4 mt-2">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a role="button">
                <img
                  className={`d-block border rounded p-3 cursor-pointer ${
                    img.url === activeImg ? "border-warning" : ""
                  } `}
                  height="100"
                  width="100"
                  src={img?.url}
                  alt={img?.url}
                  onClick={(e) => setActiveImg(img.url)}
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 col-lg-5 mt-5">
        <h3>{data?.productId?.name}</h3>
        <p id="product_id">Product # {data?.product._id}</p>

        <hr />

        <div className="d-flex">
          <StarRatings
            rating={data?.productId?.ratings}
            starRatedColor="#ffb829"
            numberOfStars={5}
            name="rating"
            starDimension="24px"
            starSpacing="1px"
          />
          <span id="no-of-reviews" className="pt-1 ps-2">
            {" "}
            ({data?.productId?.numOfReviews} Reviews){" "}
          </span>
        </div>
        <hr />

        <p id="product_price">${data?.product?.price}</p>
        <div className="stockCounter d-inline">
          <span className="btn btn-danger minus">-</span>
          <input
            type="number"
            className="form-control count d-inline"
            value="1"
            readonly
          />
          <span className="btn btn-primary plus">+</span>
        </div>
        <button
          type="button"
          id="cart_btn"
          className="btn btn-primary d-inline ms-4"
          disabled=""
        >
          Add to Cart
        </button>

        <hr />

        <p>
          Status:{" "}
          <span
            id="stock_status"
            className={data?.product?.stock > 0 ? "greenColor" : "redColor"}
          >
            {data?.product?.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </p>

        <hr />

        <h4 className="mt-2">Description:</h4>
        <p>{data?.product?.description}</p>
        <hr />
        <p id="product_seller mb-3">
          Sold by: <strong>{data?.product?.seller}</strong>
        </p>
        <p id="product_category mb-3">
          Category: <strong>{data?.product?.category}</strong>
        </p>

        <div className="alert alert-danger my-5" type="alert">
          Login to post your review.
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
