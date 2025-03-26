import axios from "axios";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;


function App2() {

  const [ account, setAccount ]  = useState({
    "username": "",
    "password": ""
  });
  const [ isAuth, setIsAuth ] = useState(false);
  const [ products, setProducts] = useState([]);
  const [ tempProduct, setTempProduct ] = useState({})

  const getProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`);
      setProducts(res.data.products);    
    } catch (error) {
      alert('取得產品失敗')
    }
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount({
      ...account,
      [name]: value
    })
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account);
      document.cookie = `hexTokennn=${res.data.token}; expires=${new Date(res.data.expired)}`;
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexTokennn\s*\=\s*([^;]*).*$)|^.*$/,
        "$1",
      );
      axios.defaults.headers.common['Authorization'] = token;
      getProducts();
      setIsAuth(true);
    } catch (error) {
      alert('登入失敗')    
    }
  };

  const checkUserLogin = async () => {
    try {     
      await axios.post(`${BASE_URL}/v2/api/user/check`)    
      alert('您已登入')
    } catch (error) {
      alert('您尚未登入')
    }
  }

  return (
    <>
    {isAuth ?
      <div className="container py-5">
        <div className="row">
          <div className="col-6">
          <button type="button" className="btn btn-success mb-5" onClick={checkUserLogin} >檢查使用者是否登入</button>
            <h2>產品列表</h2>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">查看細節</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>{product.is_enabled}</td>
                    <td>
                      <button
                        onClick={() => setTempProduct(product)}
                        className="btn btn-primary"
                        type="button"
                      >
                        查看細節
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-6">
            <h2>單一產品細節</h2>
            {tempProduct.title ? (
              <div className="card">
                <img
                  src={tempProduct.imageUrl}
                  className="card-img-top img-fluid"
                  alt={tempProduct.title}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {tempProduct.title}
                    <span className="badge text-bg-primary">
                      {tempProduct.category}
                    </span>
                  </h5>
                  <p className="card-text">商品描述：{tempProduct.description}</p>
                  <p className="card-text">商品內容：{tempProduct.content}</p>
                  <p className="card-text">
                    <del>{tempProduct.origin_price} 元</del> / {tempProduct.price}{" "}
                    元
                  </p>
                  <h5 className="card-title">更多圖片：</h5>
                  {tempProduct.imagesUrl?.map((image) => (image && (<img key={image} src={image} className="img-fluid" />)))}
                </div>
              </div>
            ) : (
              <p>請選擇一個商品查看</p>
            )}
          </div>
        </div>
      </div> : 
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mb-5">請先登入</h1>
      <form className="d-flex flex-column gap-3" onSubmit={handleLogIn}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="username"
            name="username"
            placeholder="name@example.com"
            onChange={handleInputChange}
          />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Password"
            onChange={handleInputChange}
          />
          <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-primary" type="submit">登入</button>
      </form>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div> }
      
    </>
  );
}

export default App2;
