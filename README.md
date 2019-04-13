# ZQuery

This is a small library in the spirit of JQuery, but more vanila feeling and lighter weight.

## Usage

The top level function `Z` is the entry point to this framework.

`Z` can be called the same way as JQuery's `$` function, with a single string parameter of one of the following:

1. A string representing a valid CSS selector, this will select all matching elements
1. A HTML tag surounded in `<>`, this will create a new element

After selecting something, it uses regular JavaScript DOM manipulation, but everything is a function and it allows function chaining. In addition, when there are multiple matched results, any manipulation get's applied to every result.

A notable difference from JQuery is that when a value is read from some matched results, ZQuery returns an array of values for each matched element, rather than just the first one.

ZQuery:

```JavaScript
let canvas = Z('<canvas>').width(100).height(100);
```

JS:

```JavaScript
let canvas = document.createElement('canvas');
canvas.width = 100;
canvas.height = 100;
```

There are some special cases that are not regular DOM prototype methods, these are:

---

`return` which will escape nested objects, such as

```JavaScript
let canvas = Z('<canvas>').classList().add('foo', 'bar').remove('bar').return().height(100);
```

instead of

```JavaScript
let canvas = document.createElement('canvas');
canvas.classList.add('foo', 'bar');
canvas.classList.remove('bar');
canvas.height = 100;
```

---

`size` which returns the number of elements matched

```JavaScript
let validHTML = Z('body').size() === 1;
```

---

Any number to access the matched element at that index;

```JavaScript
let htmlCanvas = Z('<canvas>')[0];
htmlCanvas.height = 100;
```

---

## Author

Jeremy Rumph

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
