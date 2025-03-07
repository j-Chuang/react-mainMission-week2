import { useState } from "react"
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH


function App() {
  const [account, setAccount] = useState({
    "username": "example@test.com",    
    "password": "example"
  })
  const [isAuth, setIsAuth] = useState(false)
  const [tempProduct, setTempProduct] = useState({});
  const [products, setProducts] = useState([]);

  // account狀態改變觸發
  const handleInputChange = (e) => {
    const {value, name} = e.target;
    setAccount({
      ...account,
      [name]:value
    })
  }

  // 取得產品，拉出改async函式
  const getProducts = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products`
      );
      setProducts(res.data.products);
    } catch (error) {
      alert("取得產品失敗");
    }
  };

  // 登入觸發，改成async函式
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${BASE_URL}/v2/admin/signin`,account)
      const {token, expired} = res.data; // 取得token
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`; // token寫入cookie
      axios.defaults.headers.common['Authorization'] = token; // 請求開始都會加入token
      getProducts();
      setIsAuth(true);
    } catch (error) {
      console.log(error);
      alert('登入失敗')
    }
  }

  //檢查使用者是否已登入
  const checkUserLogin = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/user/check`)
      alert('使用者已登入')
    } catch (error) {
      console.log(error)   
    }
  }

  //有加入第一週產品資料測試

  return (
    <>{isAuth? (<div className="container py-5">
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
    </div>) : 
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mb-5">請先登入</h1>
      <form  onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <div className="form-floating mb-3">
          <input name="username" value={account.username} onChange={handleInputChange} type="email" className="form-control" id="username" placeholder="name@example.com" />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input name="password" value={account.password} onChange={handleInputChange} type="password" className="form-control" id="password" placeholder="Password" />
          <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-primary">登入</button>
      </form>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>
    }</>    
  )
}

export default App
