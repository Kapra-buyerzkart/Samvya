import { DetectedFace, ModelReadinessState } from '../types';

export interface FaceDetectionPort {
  readonly adapterName: string;
  checkReadiness(): Promise<ModelReadinessState>;
  detectFacesInFrame(frame: unknown): Promise<DetectedFace[]>;
  release(): Promise<void>;
}
