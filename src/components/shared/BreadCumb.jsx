import React from "react";
import { Link } from "react-router-dom";

const Breadcumb = ({
    breadcumb1,
    breadcumb1Link,
    breadcumb2,
    breadcumb2Link,
}) => {
    return (
        <div>
            <Link to="/" className="text-blue-600">
                Home
            </Link>
            {breadcumb1 && (
                <Link
                    to={breadcumb1Link}
                    className={`${breadcumb2 ? "text-blue-600" : ""}`}
                >
                    {" "}
                    / {breadcumb1}
                </Link>
            )}
            {breadcumb2 && <Link to={breadcumb2Link}> / {breadcumb2}</Link>}
        </div>
    );
};

export default Breadcumb;
