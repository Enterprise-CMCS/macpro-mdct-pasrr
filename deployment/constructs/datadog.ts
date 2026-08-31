// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import {
  DatadogDefaultLayerVersions,
  DatadogLambda,
} from "datadog-cdk-constructs-v2";
import { Lambda } from "./lambda.ts";
import { LambdaDynamoEventSource } from "./lambda-dynamo-event.ts";
import {
  cmsEnvForStage,
  datadogEnvForStage,
  isDatadogEnabled,
} from "../utils/datadog-env.ts";

function appLambdas(scope: Construct): NodejsFunction[] {
  return scope.node.findAll().flatMap((child) => {
    if (child instanceof Lambda || child instanceof LambdaDynamoEventSource) {
      return [child.lambda];
    }
    return [];
  });
}

export function instrumentLambdasWithDatadog(
  scope: Construct,
  props: { stage: string; datadogApiKey?: string; service?: string }
) {
  if (!isDatadogEnabled(props.stage)) {
    return;
  }

  if (!props.datadogApiKey) {
    throw new Error(
      "datadogApiKey is required in the project default secret for val and production stages"
    );
  }

  const functions = appLambdas(scope);
  if (functions.length === 0) {
    return;
  }

  const datadog = new DatadogLambda(scope, "Datadog", {
    site: "ddog-gov.com",
    apiKey: props.datadogApiKey,
    nodeLayerVersion: DatadogDefaultLayerVersions.NODE,
    extensionLayerVersion: DatadogDefaultLayerVersions.EXTENSION,
    enableDatadogTracing: true,
    enableDatadogLogs: true,
    enableMergeXrayTraces: true,
    env: datadogEnvForStage(props.stage),
    service: props.service ?? process.env.PROJECT!,
    tags: `cms_env:${cmsEnvForStage(props.stage)}`,
    sourceCodeIntegration: false,
  });
  datadog.addLambdaFunctions(functions);
}
