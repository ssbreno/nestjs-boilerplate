/* istanbul ignore file */
import { ConfigService } from '@nestjs/config'

let configService: ConfigService

export const setConfigService = (config: ConfigService) => {
  configService = config
}

// Accessor functions to get values from ConfigService
export const getProjectName = () => configService?.get('project.name') || ''
export const getProjectDescription = () => configService?.get('project.description') || ''
export const getProjectVersion = () => configService?.get('project.version') || ''

// For backward compatibility during the transition
export const PROJECT_NAME = process.env.npm_package_name || process.env.PROJECT_NAME || ''
export const PROJECT_DESCRIPTION =
  process.env.npm_package_description || process.env.PROJECT_DESCRIPTION || ''
export const PROJECT_VERSION = process.env.npm_package_version || process.env.PROJECT_VERSION || ''
