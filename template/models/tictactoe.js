const { Model, DataTypes } = require("sequelize");

module.exports = function TictactoeModelGenerator(connection) {
    class Tictactoe extends Model {}
    
    Tictactoe.init(
        {
            id: {
                type: DataTypes.STRING,
                unique: true,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            player1: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: 3,
                },
            },
            player2: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: 3,
                },
            },
            winner: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
            },
            board: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: false,
                defaultValue: [(" ", " ", " "), (" ", " ", " "), (" ", " ", " ")],
                validate: {
                    len: 9,
                },
            },
        },
        {
            sequelize: connection,
        }
    );
    
    return Tictactoe;
    }