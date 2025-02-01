/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    safelist : [{
        pattern: /(bg|text|border|stroke|ring)-(blue|green|peach|yellow|red|pink|grey|white)-(1|2|3|4|5|6)/
    }],
    theme: {
        screens: {
            sm: "480px",
            md: "768px",
            lg: "976px",
            xl: "1440px",
        },
        colors: {
            blue: {
                1: "#172038",
                2: "#253a5e",
                3: "#3c5e8b",
                4: "#4f8fba",
                5: "#73bed3",
                6: "#a4dddb",
            },
            green: {
                1: "#19332d",
                2: "#25562e",
                3: "#468232",
                4: "#75a743",
                5: "#a8ca58",
                6: "#d0da91",
            },
            peach: {
                1: "#4d2b32",
                2: "#7a4841",
                3: "#ad7757",
                4: "#c09473",
                5: "#d7b594",
                6: "#e7d5b3",
            },
            yellow: {
                1: "#341c27",
                2: "#602c2c",
                3: "#884b2b",
                4: "#be772b",
                5: "#de9e41",
                6: "#e8c170",
            },
            red: {
                1: "#241527",
                2: "#411d31",
                3: "#752438",
                4: "#a53030",
                5: "#cf573c",
                6: "#da863e",
            },
            pink: {
                1: "#1e1d39",
                2: "#402751",
                3: "#7a367b",
                4: "#a23e8c",
                5: "#c65197",
                6: "#df84a5",
            },
            grey: {
                1: "#090a14",
                2: "#10141f",
                3: "#151d28",
                4: "#202e37",
                5: "#394a50",
                6: "#577277",
            },
            white: {
                1: "#819796",
                2: "#a8b5b2",
                3: "#c7cfcc",
                4: "#ebede9",
            },
        },
        fontFamily: {
            gotham : ['Gotham']
        },
        extend: {
            colors : {
                foreground: "#ebede9",
                background: "#c7cfcc",

                primary: "#202e37",
                secondary: "#394a50",
                tertiary: "#577277"
            }
        },
    }

};
