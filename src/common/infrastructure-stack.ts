import { Stack, StackProps } from 'aws-cdk-lib';
import { LinuxBuildImage, PipelineProject } from 'aws-cdk-lib/aws-codebuild';
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { CodeBuildAction, CodeCommitSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Construct } from 'constructs';

export interface ProjectStackProps extends StackProps {
    infrastructureName: string;
}

export class InfrastructureStack extends Stack {
    constructor(scope: Construct, id: string, props: ProjectStackProps) {
        super(scope, id, props);

        const pipeline = new Pipeline(this, 'Infrastructure-Pipeline', {
            pipelineName: `${props.infrastructureName}-Pipeline`,
            crossAccountKeys: false,
        });

        // Source
        const codeCommitRepository = new Repository(this, 'Infrastructure-Repository', {
            repositoryName: `${props.infrastructureName}`,
            description: `Repository for ${props.infrastructureName}`,
        });

        const sourceOutput = new Artifact(`${props.infrastructureName}-source-artifacts`);

        const codeCommitAction = new CodeCommitSourceAction({
            actionName: `Source-Action`,
            output: sourceOutput,
            repository: codeCommitRepository,
        });
        pipeline.addStage({
            stageName: `Source`,
            actions: [codeCommitAction],
        });

        // Build
        const codeBuildProject = new PipelineProject(this, `Infrastructure-Pipeline-Project`, {
            projectName: props.infrastructureName,
            environment: {
                buildImage: LinuxBuildImage.AMAZON_LINUX_2,
            },
        });

        const buildOutput = new Artifact(`${props.infrastructureName}-build-artifacts`);

        const codeBuildAction = new CodeBuildAction({
            actionName: `Build-Action`,
            input: sourceOutput,
            project: codeBuildProject,
            outputs: [buildOutput],
        });

        pipeline.addStage({
            stageName: `Build`,
            actions: [codeBuildAction],
        });
    }
}
