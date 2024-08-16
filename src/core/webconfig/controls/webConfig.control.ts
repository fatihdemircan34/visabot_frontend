export class WebConfigControl{

    static ApiUrl = (): string => {
        let result: string|undefined = undefined;
        switch (process.env.NEXT_PUBLIC_NODE_ENV){
            case "development": result = process.env.NEXT_PUBLIC_DEVELOPMENT_API_URL; break;
            case "stage": result =  process.env.NEXT_PUBLIC_STAGE_API_URL; break;

            default:
            case "production": result = process.env.NEXT_PUBLIC_LIVE_API_URL; break;
        }

        if(result === undefined)
            throw new Error("Uygulama bağlantı ayarları yapılmamış!");

        return result;
    }

}