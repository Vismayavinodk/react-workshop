import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/org/list")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    let interval;
    if (selectedOrg) {
      const fetchProducts = () => {
        axios
          .get(`http://localhost:8080/api/org/${selectedOrg.id}/product/list`)
          .then((response) => {
            setProducts(response.data);
          })
          .catch((error) => {
            console.error("Error fetching products:", error);
          });
      };

      fetchProducts();
      interval = setInterval(fetchProducts, 10000);
    }

    return () => clearInterval(interval);
  }, [selectedOrg]);

  return (
    data && (
      <div style={{ display: "flex" }}>
        <div>
          <h1>Organizations</h1>
          <h2>Click on an organization to view their products.</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {data.map((org) => (
                <tr key={org.id} onClick={() => setSelectedOrg(org)}>
                  <td>{org.name}</td>
                  <td>{org.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedOrg && (
          <div style={{ marginLeft: "90px" }}>
            <h2>Products of {selectedOrg.name}</h2>
            <table border="1">
              <thead>
                <tr>
                  <th>Product Name</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  );
}

export default App;
