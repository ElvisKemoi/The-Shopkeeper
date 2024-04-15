(() => {
	"use strict";

	const getStoredTheme = () => localStorage.getItem("theme");
	const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

	const getPreferredTheme = () => {
		const storedTheme = getStoredTheme();
		if (storedTheme) {
			return storedTheme;
		}

		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	};

	const setTheme = (theme) => {
		if (
			theme === "auto" &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
		) {
			document.documentElement.setAttribute("arr-bs-theme", "dark");
		} else {
			document.documentElement.setAttribute("data-bs-theme", theme);
		}
	};

	setTheme(getPreferredTheme());

	const showActiveTheme = (theme, focus = false) => {
		const themeSwitcher = document.querySelector("#bd-theme");

		if (!themeSwitcher) {
			return;
		}

		const themeSwitcherText = document.querySelector("#bd-theme-text");
		const activeThemeIcon = document.querySelector(".theme-icon-active use");
		const btnToActive = document.querySelector(
			`[data-bs-theme-value="${theme}"]`
		);
		const svgOfActiveBtn = btnToActive
			.querySelector("svg use")
			.getAttribute("href");

		document.querySelectorAll("[data-bs-theme-value]").forEach((element) => {
			element.classList.remove("active");
			element.setAttribute("aria-pressed", "false");
		});

		btnToActive.classList.add("active");
		btnToActive.setAttribute("aria-pressed", "true");
		activeThemeIcon.setAttribute("href", svgOfActiveBtn);
		const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
		themeSwitcher.setAttribute("aria-label", themeSwitcherLabel);

		if (focus) {
			themeSwitcher.focus();
		}
	};

	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", () => {
			const storedTheme = getStoredTheme();
			if (storedTheme !== "light" && storedTheme !== "dark") {
				setTheme(getPreferredTheme());
			}
		});

	window.addEventListener("DOMContentLoaded", () => {
		showActiveTheme(getPreferredTheme());

		document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
			toggle.addEventListener("click", () => {
				const theme = toggle.getAttribute("data-bs-theme-value");
				setStoredTheme(theme);
				setTheme(theme);
				showActiveTheme(theme, true);
			});
		});
	});
})();

// Truncate string

function truncateString(str, maxLength) {
	if (str.length > maxLength) {
		return str.slice(0, maxLength - 3) + "...";
	}
	return str;
}
// Cart
let currentCarts = []; // Use let instead of const since currentCarts is being modified
const allCarts = document.querySelectorAll(".bx-cart-add");
const cartItems = document.getElementById("cartItem");

allCarts.forEach((cart) =>
	cart.addEventListener("click", () => {
		cart.classList.toggle("carted");

		let toAdd = cart.id.split(",");
		let dictionary = {}; // Initialize an empty dictionary

		let valueToCheck = toAdd[0]; // Value to check

		let isPresent = currentCarts.some((dictionary) => {
			return Object.values(dictionary).includes(valueToCheck);
		});

		if (isPresent) {
			currentCarts = currentCarts.filter(
				(dictionary) => !Object.values(dictionary).includes(toAdd[0])
			);
			// updateList(currentCarts);

			console.log(`${valueToCheck} removed from the array.`);
		} else {
			let keys = ["id", "title", "price"];
			let i = 0;
			toAdd.forEach((item, index) => {
				let key = keys[i];
				i++; // Create a key for each item (e.g., key1, key2, key3, ...)
				dictionary[key] = item; // Assign the item to the key in the dictionary
			});

			currentCarts.push(dictionary);
			// console.table(dictionary);
			console.log(`${valueToCheck} added to the array.`);
		}
		setCartHeaders(currentCarts);
		updateCartList(currentCarts);
		console.table(currentCarts);
		addSubmitButton();
	})
);

function addSubmitButton() {
	console.log(document.getElementById("cartItems").innerHTML === "");
	if (document.getElementById("cartItems").innerHTML === "") {
		document.getElementById("cartFoot").innerHTML = "";
	} else if (document.getElementById("cartItems").innerHTML !== "") {
		document.getElementById("cartFoot").innerHTML =
			"<td colspan='3'><button class='btn btn-oultline-primary' type='submit'>Submit</button></form></td>";
	}
}

function setCartHeaders(arr) {
	if (arr.length !== 0) {
		let headers = Object.keys(arr[0]);
		document.getElementById("itemTitle").innerHTML = headers[1];
		document.getElementById("itemPrice").innerHTML =
			"Unit " + headers[2] + "(Ksh)";
	} else {
		document.getElementById("itemTitle").innerHTML = "";
		document.getElementById("itemPrice").innerHTML = "";
	}
}

function updateCartList(arr) {
	let concat = "";
	let l = 0;
	arr.forEach((dict) => {
		concat =
			concat +
			"<tr><td>" +
			dict.title +
			"</td><td>" +
			dict.price +
			"</td><td><form  ><input class='increment' type='number' id='quantity' style='width: 3rem'  name='quantity' value='1' min='1'></td><td id= 'itemTotal'></td></tr>";
		l++;
	});

	document.getElementById("cartItems").innerHTML = concat;
	console.log("Done");
	updateItemTotals();
}

function updateItemTotals() {
	document.querySelectorAll(".increment").forEach((item) => {
		item.addEventListener("change", () => {
			console.log(item.value);
		});
	});
	// console.log(
	// 	document.getElementById("itemTotal").previousElementSibling.children[0]
	// 		.children[0].value
	// );
}
