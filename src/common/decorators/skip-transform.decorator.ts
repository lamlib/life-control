import { SetMetadata } from "@nestjs/common";
import { IS_SKIP_TRANSFORM } from "../constants/transform.constants";

export const SkipTransform = () => SetMetadata(IS_SKIP_TRANSFORM, true);