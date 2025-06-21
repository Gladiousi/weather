export { };

declare global {
    interface Window {
        Telegram: {
            WebApp: {
                initData: string;
                openInvoice(link: string, callback: (status: string) => void): void;
                expand: () => void;
                initDataUnsafe?: {
                    user?: {
                        id: number;
                        first_name: string;
                        last_name?: string;
                        username?: string;
                    };
                };
            };
        };
    }
}