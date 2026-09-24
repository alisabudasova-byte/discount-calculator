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
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("electronics");
  const [calculated, setCalculated] = useState(false);
  const [error, setError] = useState("");

  const handlePriceChange = (event) => {
    const value = event.target.value;

    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
      setError("");
      setCalculated(false);
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setCalculated(false);
  };

  const handleCalculate = () => {
    const numPrice = parseFloat(price);

    if (!price.trim()) {
      setError("Введите цену");
      setCalculated(false);
      return;
    }

    if (isNaN(numPrice) || numPrice <= 0) {
      setError("Цена должна быть больше 0");
      setCalculated(false);
      return;
    }

    setError("");
    setCalculated(true);
  };

  const handleReset = () => {
    setPrice("");
    setCategory("electronics");
    setCalculated(false);
    setError("");
  };

  const selectedCategory = CATEGORIES.find(
    (item) => item.id === category
  );

  const numPrice = parseFloat(price) || 0;

  const discountPercent = selectedCategory
    ? selectedCategory.discount
    : 0;

  const discountAmount = calculated
    ? numPrice * (discountPercent / 100)
    : 0;

  const priceAfterDiscount = calculated
    ? numPrice - discountAmount
    : 0;

  const vatAmount = calculated
    ? priceAfterDiscount * VAT_RATE
    : 0;

  const total = calculated
    ? priceAfterDiscount + vatAmount
    : 0;

  const formatRub = (value) => {
    return value.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="calculator">
      <h1>Калькулятор скидок</h1>

      <div className="field">
        <label htmlFor="price">Цена товара</label>

        <input
          id="price"
          type="text"
          inputMode="decimal"
          value={price}
          onChange={handlePriceChange}
          placeholder="Введите цену"
          className={error ? "input error-input" : "input"}
        />

        {error && <p className="error">{error}</p>}
      </div>

      <div className="field">
        <label htmlFor="category">Категория товара</label>

        <select
          id="category"
          value={category}
          onChange={handleCategoryChange}
          className="input"
        >
          {CATEGORIES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label} — скидка {item.discount}%
            </option>
          ))}
        </select>
      </div>

      <div className="buttons">
        <button type="button" onClick={handleCalculate}>
          Рассчитать
        </button>

        <button type="button" onClick={handleReset}>
          Сбросить
        </button>
      </div>

      {calculated && !error && (
        <div className="results">
          <h2>Результат расчёта</h2>

          <table>
            <tbody>
              <tr>
                <td>Исходная цена</td>
                <td>{formatRub(numPrice)} ₽</td>
              </tr>

              <tr>
                <td>Скидка ({discountPercent}%)</td>
                <td>- {formatRub(discountAmount)} ₽</td>
              </tr>

              <tr>
                <td>Цена после скидки</td>
                <td>{formatRub(priceAfterDiscount)} ₽</td>
              </tr>

              <tr>
                <td>НДС (22%)</td>
                <td>+ {formatRub(vatAmount)} ₽</td>
              </tr>

              <tr className="total">
                <td>Итого к оплате</td>
                <td>{formatRub(total)} ₽</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DiscountCalculator;