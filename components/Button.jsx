"use client";

export default function Button({ children, onClick, variant = "primary" }) {
  const styles = {
    primary: "btn btn-primary",
    ghost: "btn",
  };

  return (
    <button onClick={onClick} className={styles[variant]}>
      {children}
    </button>
  );
}
