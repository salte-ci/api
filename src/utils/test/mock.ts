import * as Chance from 'chance';
import { database } from '../../models/database';
import { PROVIDER_TYPES } from '../../models/provider';

export const chance = new Chance();

export type Overrides = {
  [key: string]: any;
};

export async function CreateAccount(overrides?: Overrides) {
  const { AccountModel } = await database();

  return AccountModel.create({
    id: chance.string(),
    ...overrides,
  });
}

export async function CreateBot(overrides?: Overrides) {
  const { BotModel } = await database();

  return BotModel.create({
    id: chance.string(),
    api_key: chance.string(),
    ...overrides,
  });
}

export async function CreateUser(overrides?: Overrides) {
  const { UserModel } = await database();

  return UserModel.create({
    id: chance.string(),
    ...overrides,
  });
}

export async function CreateProvider(overrides?: Overrides) {
  const { ProviderModel } = await database();

  return ProviderModel.create({
    app_id: chance.string(),
    private_key: chance.string(),
    client_id: chance.string(),
    client_secret: chance.string(),
    name: chance.string({ alpha: true }),
    friendly_name: chance.string(),
    type: chance.pickone(PROVIDER_TYPES),
    url: chance.url(),
    api_url: chance.url(),
    ...overrides,
  });
}

export async function CreateOrganization(overrides?: Overrides) {
  const { OrganizationModel } = await database();

  return OrganizationModel.create({
    ...overrides
  });
}

export async function CreateRepository(overrides?: Overrides) {
  const { RepositoryModel } = await database();

  return RepositoryModel.create({
    slug: chance.string(),
    private: chance.bool(),
    ...overrides,
  });
}

export async function CreateBuild(overrides?: Overrides) {
  const { BuildModel } = await database();

  return BuildModel.create({
    ...overrides,
  });
}

export async function CreateEnvironmentVariable(overrides?: Overrides) {
  const { EnvironmentVariableModel } = await database();

  return EnvironmentVariableModel.create({
    scope: chance.string(),
    key: chance.string(),
    masked: chance.bool(),
    value: chance.string(),
    ...overrides,
  });
}

export async function CreateLinkedAccount(overrides?: Overrides) {
  const { LinkedAccountModel } = await database();

  return LinkedAccountModel.create({
    access_token: chance.string(),
    ...overrides,
  });
}

export async function CreateRunner(overrides?: Overrides) {
  const { RunnerModel } = await database();

  return RunnerModel.create({
    ...overrides,
  });
}
