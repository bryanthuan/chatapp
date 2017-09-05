const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {

    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: 1,
            name: 'Brian',
            room: 'A'
        },{
            id: 2,
            name: 'Thuan',
            room: 'A'
        },{
            id: 3,
            name: 'Nguyen',
            room: 'B'
        },
        ];
    });

    it('should add a user', () => {
        const user = {
            id: 123,
            name: 'Brian',
            room: 'Bo Vo'
        };
        const resUser = new Users();
        resUser.addUser(user.id, user.name, user.room);
        expect(resUser.users).toEqual([user]);
    });

    it('should return name for room A', () => {
        const userList = users.getUserList('A');
        expect(userList).toEqual(['Brian','Thuan']);
    });

    it('should remove a user', () => {
        users.removeUser(2);
        expect(users.users.length).toBe(2);
    });

    it('should return a user', () => {
        const user = users.getUser(1);
        expect(user).toInclude( {name: 'Brian'} );
    })
});