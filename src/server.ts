//@ts-ignore
import { serverHttp } from './http.ts';
//@ts-ignore
import './websokect.ts';

const port = process.env.PORT || 3000;

const server = serverHttp.listen(port, () => console.log(`App ouvindo port ${port}`));
