﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Binner.Data.Migrations.SqlServer.Migrations
{
    /// <inheritdoc />
    public partial class AddTokenConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TokenConfig",
                schema: "dbo",
                table: "UserTokens",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TokenConfig",
                schema: "dbo",
                table: "UserTokens");
        }
    }
}
