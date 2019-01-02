from faker import Faker
import json
import random
import random
fake = Faker()

goals = []
organizations = []
users = []
roles = []
permissions = []
role_permission_s = []

###########################
# ORGANIZATION
###########################
for id in range(1, 11):
    organization = {}
    organization["id"] = id
    organization["name"] = fake.company()
    organization["description"] = fake.text()
    organizations.append(organization)

def get_rand_organization_id():
    return random.choice(organizations)["id"]

###########################
# ROLE
###########################
some_fake_jobs = [fake.job() for _ in range(10)]

roles_used = set()
for id in range(1, 20):
    organization_id = get_rand_organization_id()
    role_name = random.choice(some_fake_jobs)

    if (organization_id, role_name) in roles_used:
        continue

    role = {}
    role["id"] = id
    role["name"] = role_name
    role["description"] = fake.text()
    role["organization_id"] = organization_id
    roles.append(role)
    roles_used.add((organization_id, role_name))

def get_rand_role_id():
    return random.choice(roles)["id"]

###########################
# GOAL and USER
###########################
for id in range(1, 4):
    goal = {}
    goal["id"] = id
    goal["name"] = fake.text()[:10]
    goal["description"] = fake.text()
    goal["user_id"] = id
    goals.append(goal)

    user = {}
    user["id"] = id
    user["name"] = fake.name()

    one_role = random.choice(roles)
    user["organization_id"] = one_role["organization_id"]
    user["role_id"] = one_role["id"]
    user["token"] = str(id)

    users.append(user)



###########################
# PERMISSION
###########################
for id in range(1, 11):
    permission = {}
    permission["id"] = id
    permission["code"] = fake.bban()
    permission["description"] = fake.text()
    permissions.append(permission)

def get_rand_permission_id():
    return random.choice(permissions)["id"]

###########################
# ROLE_PERMISSION
###########################
role_permission_set = set()
for _ in range(10):
    role_id = get_rand_role_id()
    permission_id = get_rand_permission_id()

    if (role_id, permission_id) in role_permission_set:
        continue

    role_permission = {}
    role_permission["role_id"] = get_rand_role_id()
    role_permission["permission_id"] = get_rand_permission_id()
    role_permission_set.add((role_id, permission_id))

    role_permission_s.append(role_permission)


goals_json = json.dumps(goals, indent=4)
permissions_json = json.dumps(permissions, indent=4)
organizations_json = json.dumps(organizations, indent=4)
users_json = json.dumps(users, indent=4)
roles_json = json.dumps(roles, indent=4)
role_permission_json = json.dumps(role_permission_s, indent=4)

with open('data/organizations.js', 'w') as f:
    f.write("module.exports = {0}".format(organizations_json))
    # print("module.exports = {0}".format(organizations_json))

with open('data/users.js', 'w') as f:
    f.write("module.exports = {0}".format(users_json))
    # print("module.exports = {0}".format(users_json))

with open('data/goals.js', 'w') as f:
    f.write("module.exports = {0}".format(goals_json))
    # print("module.exports = {0}".format(goals_json))

with open('data/roles.js', 'w') as f:
    f.write("module.exports = {0}".format(roles_json))
    # print("module.exports = {0}".format(roles_json))

with open('data/permissions.js', 'w') as f:
    f.write("module.exports = {0}".format(permissions_json))
    # print("module.exports = {0}".format(permissions_json))

with open('data/role_permission.js', 'w') as f:
    f.write("module.exports = {0}".format(role_permission_json))
    # print("module.exports = {0}".format(role_permission_json))
