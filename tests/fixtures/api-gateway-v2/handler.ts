import '../controllers/rootController';

import '../controllers/optionsController';
import '../controllers/deleteController';
import '../controllers/getController';
import '../controllers/headController';
import '../controllers/patchController';
import '../controllers/postController';
import '../controllers/putController';

import '../controllers/methodController';
import '../controllers/mediaTypeController';
import '../controllers/parameterController';
import '../controllers/securityController';
import '../controllers/testController';
import '../controllers/validateController';
import '../controllers/exampleController';
import '../controllers/tagController';
import '../controllers/noExtendsController';
import '../controllers/subresourceController';

import { RegisterRoutes } from './routes';

export const handler = RegisterRoutes();
