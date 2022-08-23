import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { InfrastructureStack } from '../common/project-stack';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class HiveMindInfrastructureStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const project = new InfrastructureStack(this, 'HiveMind-Ui-Project', {
            infrastructureName: `HiveMindUi`,
        });
    }
}
