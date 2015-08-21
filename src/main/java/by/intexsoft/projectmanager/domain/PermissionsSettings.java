package by.intexsoft.projectmanager.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

@Entity
@Table (name="permissions_settings")
public class PermissionsSettings {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY )
	@Column(name = "perm_settings_id")
	@PrimaryKeyJoinColumn
	public Long id;
	
	public Boolean viewIterationCalendar = true;
	public Boolean addIterationCalendar = false;
	public Boolean editIterationCalendar = false;
	public Boolean viewAllIterations = false;
	
	public Boolean viewProject = true;
	public Boolean addProject = false;
	public Boolean editProject = false;
	public Boolean viewAllProjects = false;
	
	public Boolean viewTaskCalendar = true;
	public Boolean addTaskCalendar = false;
	public Boolean editTaskCalendar = false;
	public Boolean viewAllTaskCalendars = false;

	public Boolean viewChecklist = true;
	public Boolean addChecklist = false;
	public Boolean editChecklist = false;
	public Boolean viewAllChecklists = false;
	
	public Boolean editPermissionsSettings = false;
	
	@OneToOne(mappedBy = "permissionsSettings")
	public User user;
}
