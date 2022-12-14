import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';


class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html>
                <Head>
                    {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                    <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" /> */}

                    <link rel="preload" href="/fonts/Poppins/Poppins-Medium.ttf" as="font" crossOrigin="" />
                    <link rel="preload" href="/fonts/Poppins/Poppins-Bold.ttf" as="font" crossOrigin="" />
                </Head>
                <body style={{ fontFamily: "Poppins, sans-serif" }}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
