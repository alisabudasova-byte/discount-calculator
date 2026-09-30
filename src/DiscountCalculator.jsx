import { useState } from "react";
import "./DiscountCalculator.css";

const CATEGORIES = [
  { id: "electronics", label: "Электроника", discount: 5 },
  { id: "clothing", label: "Одежда", discount: 15 },
  { id: "groceries", label: "Продукты", discount: 10 },
  { id: "books", label: "Книги", discount: 20 },
  { id: "other", label: "Другое", discount: 0 },
];

const VAT_RATE = 0.22;

function DiscountCalculator() {
  const [products, setProducts] = useState([
    {
      id: 1,
      price: "",
      category: "electronics",
    },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [customDiscount, setCustomDiscount] = useState(0);
  const [useCustomDiscount, setUseCustomDiscount] = useState(false);
  const [includeVat, setIncludeVat] = useState(true);

  const [calculated, setCalculated] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const handlePriceChange = (id, value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id
            ? { ...product, price: value }
            : product
        )
      );

      setError("");
      setCalculated(false);
    }
  };

  const handleCategoryChange = (id, value) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, category: value }
          : product
      )
    );

    setCalculated(false);
  };

  const addProduct = () => {
    const newProduct = {
      id: Date.now(),
      price: "",
      category: "electronics",
    };

    setProducts((prevProducts) => [
      ...prevProducts,
      newProduct,
    ]);

    setCalculated(false);
  };

  const removeProduct = (id) => {
    if (products.length === 1) {
      return;
    }

    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );

    setCalculated(false);
  };

  const handleCalculate = () => {
    const hasEmptyPrice = products.some(
      (product) => !product.price.trim()
    );

    if (hasEmptyPrice) {
      setError("Введите цену для всех товаров");
      setCalculated(false);
      return;
    }

    const hasInvalidPrice = products.some(
      (product) =>
        isNaN(parseFloat(product.price)) ||
        parseFloat(product.price) <= 0
    );

    if (hasInvalidPrice) {
      setError("Цена каждого товара должна быть больше 0");
      setCalculated(false);
      return;
    }

    setError("");
    setCalculated(true);

    const result = calculateResult();

    setHistory((prevHistory) => [
      result,
      ...prevHistory,
    ].slice(0, 5));
  };

  const handleReset = () => {
    setProducts([
      {
        id: 1,
        price: "",
        category: "electronics",
      },
    ]);

    setPromoCode("");
    setCustomDiscount(0);
    setUseCustomDiscount(false);
    setIncludeVat(true);
    setCalculated(false);
    setError("");
  };

  const calculateResult = () => {
    let totalBeforeVat = 0;
    let totalDiscount = 0;

    products.forEach((product) => {
      const price = parseFloat(product.price) || 0;

      const selectedCategory = CATEGORIES.find(
        (category) => category.id === product.category
      );

      const categoryDiscount = selectedCategory
        ? selectedCategory.discount
        : 0;

      const baseDiscount = useCustomDiscount
        ? customDiscount
        : categoryDiscount;

      const promoDiscount =
        promoCode.trim().toUpperCase() === "WELCOME10"
          ? 10
          : 0;

      const totalDiscountPercent =
        baseDiscount + promoDiscount;

      const discountAmount =
        price * (totalDiscountPercent / 100);

      const priceAfterDiscount =
        price - discountAmount;

      totalBeforeVat += priceAfterDiscount;
      totalDiscount += discountAmount;
    });

    const vatAmount = includeVat
      ? totalBeforeVat * VAT_RATE
      : 0;

    const total = totalBeforeVat + vatAmount;

    return {
      date: new Date().toLocaleString("ru-RU"),
      productsCount: products.length,
      totalDiscount,
      vatAmount,
      total,
    };
  };

  const result = calculated ? calculateResult() : null;

  const formatRub = (value) => {
    return value.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="calculator">
      <h1>Калькулятор скидок</h1>

      {products.map((product, index) => (
        <div className="product" key={product.id}>
          <div className="product-header">
            <h2>Товар {index + 1}</h2>

            {products.length > 1 && (
              <button
                type="button"
                className="remove-button"
                onClick={() => removeProduct(product.id)}
              >
                Удалить
              </button>
            )}
          </div>

          <div className="field">
            <label htmlFor={`price-${product.id}`}>
              Цена товара
            </label>

            <input
              id={`price-${product.id}`}
              type="text"
              inputMode="decimal"
              value={product.price}
              onChange={(event) =>
                handlePriceChange(
                  product.id,
                  event.target.value
                )
              }
              placeholder="Введите цену"
              className="input"
            />
          </div>

          <div className="field">
            <label htmlFor={`category-${product.id}`}>
              Категория товара
            </label>

            <select
              id={`category-${product.id}`}
              value={product.category}
              onChange={(event) =>
                handleCategoryChange(
                  product.id,
                  event.target.value
                )
              }
              className="input"
            >
              {CATEGORIES.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.label} — скидка{" "}
                  {category.discount}%
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="add-button"
        onClick={addProduct}
      >
        + Добавить товар
      </button>

      <div className="field">
        <label htmlFor="customDiscount">
          <h2>Кастомная скидка: {customDiscount}% </h2>
        </label>

        <input
          id="customDiscount"
          type="range"
          min="0"
          max="50"
          value={customDiscount}
          onChange={(event) => {
            setCustomDiscount(Number(event.target.value));
            setUseCustomDiscount(true);
            setCalculated(false);
          }}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={useCustomDiscount}
            onChange={(event) => {
              setUseCustomDiscount(event.target.checked);
              setCalculated(false);
            }}
          />
          Использовать кастомную скидку вместо скидки категории
        </label>
      </div>

      <div className="field">
        <label htmlFor="promoCode">
          <h2>Промокод</h2>
        </label>

        <input
          id="promoCode"
          type="text"
          value={promoCode}
          onChange={(event) => {
            setPromoCode(event.target.value);
            setCalculated(false);
          }}
          placeholder="WELCOME10"
          className="input"
        />

        <p className="promo-hint">
          WELCOME10 — дополнительная скидка 10%
        </p>
      </div>

      <div className="vat-switch">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={includeVat}
            onChange={(event) => {
              setIncludeVat(event.target.checked);
              setCalculated(false);
            }}
          />
          Учитывать НДС 22%
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="buttons">
        <button
          type="button"
          onClick={handleCalculate}
        >
          Рассчитать
        </button>

        <button
          type="button"
          onClick={handleReset}
        >
          Сбросить
        </button>
      </div>

      {result && !error && (
        <div className="results">
          <h2>Результат расчёта</h2>

          <table>
            <tbody>
              <tr>
                <td>Количество товаров</td>
                <td>{result.productsCount}</td>
              </tr>

              <tr>
                <td>Общая скидка</td>
                <td>
                  - {formatRub(result.totalDiscount)} ₽
                </td>
              </tr>

              <tr>
                <td>НДС</td>
                <td>
                  {includeVat
                    ? `+ ${formatRub(result.vatAmount)} ₽`
                    : "Без НДС"}
                </td>
              </tr>

              <tr className="total">
                <td>Итого к оплате</td>
                <td>{formatRub(result.total)} ₽</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {history.length > 0 && (
        <div className="history">
          <h2>История расчётов</h2>

          {history.map((item, index) => (
            <div className="history-item" key={index}>
              <p>
                <strong>{item.date}</strong>
              </p>

              <p>
                Товаров: {item.productsCount}
              </p>

              <p>
                Скидка: -{formatRub(item.totalDiscount)} ₽
              </p>

              <p>
                НДС:{" "}
                {item.vatAmount > 0
                  ? `+${formatRub(item.vatAmount)} ₽`
                  : "без НДС"}
              </p>

              <p>
                <strong>
                  Итого: {formatRub(item.total)} ₽
                </strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DiscountCalculator;